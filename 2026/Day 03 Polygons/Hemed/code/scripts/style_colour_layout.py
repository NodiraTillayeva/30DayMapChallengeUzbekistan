#!/usr/bin/env python3
"""Style the accepted project without changing any boundary or population data."""
import hashlib
import json
import os
from pathlib import Path
os.environ.setdefault('QT_QPA_PLATFORM','offscreen')
from qgis.PyQt.QtCore import Qt
from qgis.PyQt.QtGui import QColor,QFont,QFontDatabase
from qgis.core import (
    QgsApplication,QgsProject,QgsFillSymbol,QgsCategorizedSymbolRenderer,
    QgsRendererCategory,QgsRuleBasedRenderer,QgsMapLayerStyle,QgsTextFormat,
    QgsPrintLayout,QgsLayoutItemMap,QgsLayoutItemLabel,QgsLayoutItemShape,
    QgsLayoutSize,QgsLayoutPoint,QgsLayoutExporter,QgsRectangle,Qgis,
)
ROOT=Path(__file__).resolve().parent.parent
if os.environ.get('QGIS_PREFIX_PATH'):
    QgsApplication.setPrefixPath(os.environ['QGIS_PREFIX_PATH'],True)
app=QgsApplication([],False)
app.initQgis()
for name in ['Barlow-Regular.ttf','Barlow-SemiBold.ttf']:
    assert QFontDatabase.addApplicationFont(str(ROOT/'source'/name))>=0
project=QgsProject.instance()
project_path=ROOT/'Uzbekistan_Population_Facets_4_Columns.qgz'
assert project.read(str(project_path))
gpkg=ROOT/'data/uzbekistan_facets.gpkg'
before=hashlib.sha256(gpkg.read_bytes()).hexdigest()
facets=next(l for l in project.mapLayers().values() if '|layername=facets' in l.source())
labels=next(l for l in project.mapLayers().values() if '|layername=optional_labels' in l.source())
features=sorted(facets.getFeatures(),key=lambda f:int(f['facet_index']))
assert len(features)==14
values=[int(f['pop_2026']) for f in features]
low,high=min(values),max(values)
def mix(a,b,t):
    return QColor(*[round(a[i]+(b[i]-a[i])*t) for i in range(3)]).name()
def population_colour(value):
    t=(value-low)/(high-low)
    return mix((179,222,205),(57,164,160),t*2) if t<0.5 else mix((57,164,160),(21,94,117),(t-0.5)*2)
colours={int(f['facet_index']):population_colour(int(f['pop_2026'])) for f in features}
def symbol(colour):
    return QgsFillSymbol.createSimple({'color':colour,'outline_style':'no','joinstyle':'miter'})
categories=[]
for f in features:
    rank=int(f['facet_index'])
    name=str(f['NAME_1']).rstrip("'")
    categories.append(QgsRendererCategory(rank,symbol(colours[rank]),f'{rank:02d}  {name}  ·  {f["pop_2026"]}'))
renderer=QgsCategorizedSymbolRenderer('facet_index',categories)
facets.setRenderer(renderer.clone())
facets.setLabelsEnabled(False)
facets.setName('Population facets | colour | 4 columns')
labels.setName('Region names and population')
settings=labels.labeling().settings()
fmt=QgsTextFormat()
font=QFont('Barlow SemiBold',8)
font.setWeight(QFont.DemiBold)
fmt.setFont(font)
fmt.setSize(8)
fmt.setColor(QColor('#223C44'))
settings.setFormat(fmt)
from qgis.core import QgsVectorLayerSimpleLabeling
labels.setLabeling(QgsVectorLayerSimpleLabeling(settings))
labels.setLabelsEnabled(True)
tree=project.layerTreeRoot()
tree.findLayer(facets.id()).setItemVisibilityChecked(True)
tree.findLayer(labels.id()).setItemVisibilityChecked(True)
tree.findLayer(facets.id()).setExpanded(False)
tree.findLayer(labels.id()).setExpanded(False)
project.setBackgroundColor(QColor('#F3F6F3'))
project.setTitle('Uzbekistan — Population by region — 2026')
project.setFilePathStorage(Qgis.FilePathType.Relative)
for old in list(project.layoutManager().layouts()):
    project.layoutManager().removeLayout(old)
layout=QgsPrintLayout(project)
layout.initializeDefaults()
layout.setName('01 Uzbekistan - Population by region - Colour')
page=layout.pageCollection().pages()[0]
page.setPageSize(QgsLayoutSize(297,420))
page.setPageStyleSymbol(symbol('#F3F6F3'))

def rect(x,y,w,h,colour,z=0):
    item=QgsLayoutItemShape(layout)
    item.setShapeType(QgsLayoutItemShape.Rectangle)
    item.setSymbol(symbol(colour))
    layout.addLayoutItem(item)
    item.attemptMove(QgsLayoutPoint(x,y))
    item.attemptResize(QgsLayoutSize(w,h))
    item.setZValue(z)
    return item
def text(value,x,y,w,h,size=10,colour='#183941',bold=False,align=Qt.AlignLeft):
    item=QgsLayoutItemLabel(layout)
    item.setText(str(value))
    font=QFont('Barlow SemiBold' if bold else 'Barlow')
    font.setPointSizeF(size)
    font.setWeight(QFont.DemiBold if bold else QFont.Normal)
    item.setFont(font)
    item.setFontColor(QColor(colour))
    item.setMargin(0)
    item.setBackgroundEnabled(False)
    item.setFrameEnabled(False)
    item.setHAlign(align)
    item.setVAlign(Qt.AlignVCenter)
    layout.addLayoutItem(item)
    item.attemptMove(QgsLayoutPoint(x,y))
    item.attemptResize(QgsLayoutSize(w,h))
    item.setZValue(5)
    return item

text('UZBEKISTAN',17,16,263,16,30,bold=True,align=Qt.AlignHCenter)
text('Population by region',17,35,263,11,17,align=Qt.AlignHCenter)
text('1 JANUARY 2026  /  14 ADMINISTRATIVE AREAS',17,51,263,6,8.7,colour='#537078',align=Qt.AlignHCenter)
text('Regions ranked from highest to lowest population',17,60,263,6,10,colour='#537078',align=Qt.AlignHCenter)
rect(17,70,263,0.45,'#B6CCCA')

for index,f in enumerate(features):
    row,col=divmod(index,4)
    x,y=17+col*67,80+row*75
    text(f'{index+1:02d}',x+3,y+2,14,4,7.5,colour='#81958F')
    # A stored style override isolates this feature without creating extra layers.
    root=QgsRuleBasedRenderer.Rule(None)
    rule=QgsRuleBasedRenderer.Rule(symbol(colours[index+1]))
    rule.setFilterExpression(f'"facet_index" = {index+1}')
    root.appendChild(rule)
    facets.setRenderer(QgsRuleBasedRenderer(root))
    style=QgsMapLayerStyle()
    style.readFromLayer(facets)
    map_item=QgsLayoutItemMap(layout)
    layout.addLayoutItem(map_item)
    map_item.attemptMove(QgsLayoutPoint(x+4,y+7))
    map_item.attemptResize(QgsLayoutSize(54,40))
    map_item.setCrs(facets.crs())
    map_item.setLayers([facets])
    map_item.setKeepLayerSet(True)
    map_item.setKeepLayerStyles(True)
    map_item.setLayerStyleOverrides({facets.id():style.xmlData()})
    centre=f.geometry().boundingBox().center()
    map_item.zoomToExtent(QgsRectangle(centre.x()-55,centre.y()-55,centre.x()+55,centre.y()+55))
    map_item.setBackgroundEnabled(False)
    map_item.setFrameEnabled(False)
    map_item.setZValue(2)
    map_item.setId(f'facet_{index+1:02d}')
    name=str(f['NAME_1']).rstrip("'")
    text(name,x+2,y+48.6,58,7,11.5,bold=True,align=Qt.AlignHCenter)
    text(str(int(f['pop_2026'])),x+2,y+55.7,58,8.3,14.5,colour='#276D75',align=Qt.AlignHCenter)
facets.setRenderer(renderer.clone())

text('Population scale',151,315,129,8,12,bold=True)
for i in range(32):
    rect(151+i*(129/32),329,129/32+0.03,4.6,population_colour(low+(high-low)*i/31),1)
text(str(low),151,336,60,5.5,8.5,colour='#537078')
text(str(high),220,336,60,5.5,8.5,colour='#537078',align=Qt.AlignRight)
text('Light = lower   ·   Dark = higher',151,345,129,6,9,colour='#537078')
text('Outlines fit equal cells. Population controls colour and reading order.',17,375.5,263,6.5,8.7,colour='#537078',align=Qt.AlignHCenter)
rect(17,385,263,0.3,'#B6CCCA')
text('Population: National Statistics Committee of Uzbekistan · 1 January 2026 · Rounded to 100 people.',17,390,263,5,7.5,colour='#537078',align=Qt.AlignHCenter)
text('Boundaries: geoBoundaries gbOpen / © OpenStreetMap contributors · ODbL 1.0 · Boundary year: 2017.',17,396,263,5,7.5,colour='#537078',align=Qt.AlignHCenter)
text('14 areas: 12 regions, the Republic of Karakalpakstan and Tashkent city.',17,402,263,5,7.5,colour='#537078',align=Qt.AlignHCenter)
project.layoutManager().addLayout(layout)
assert project.write(str(project_path))
assert hashlib.sha256(gpkg.read_bytes()).hexdigest()==before,'Geographic data changed during restyling'
project.clear()
assert project.read(str(project_path))
assert len(project.mapLayers())==3
layout=project.layoutManager().layoutByName('01 Uzbekistan - Population by region - Colour')
maps=[item for item in layout.items() if isinstance(item,QgsLayoutItemMap)]
assert len(maps)==14 and all(len(m.layerStyleOverrides())==1 for m in maps)
assert all(l.isValid() and l.featureCount()==14 for l in project.mapLayers().values())
exporter=QgsLayoutExporter(layout)
image_settings=QgsLayoutExporter.ImageExportSettings()
image_settings.dpi=170
assert exporter.exportToImage(str(ROOT/'Preview_Colour_Layout.png'),image_settings)==QgsLayoutExporter.Success
pdf_settings=QgsLayoutExporter.PdfExportSettings()
pdf_settings.dpi=300
pdf_settings.textRenderFormat=Qgis.TextRenderFormat.AlwaysText
assert exporter.exportToPdf(str(ROOT/'Uzbekistan_Population_Colour_Layout.pdf'),pdf_settings)==QgsLayoutExporter.Success
for obsolete in ['Preview_Silhouettes.png','Preview_With_Population.png','Silhouettes_4_Columns.pdf']:
    (ROOT/obsolete).unlink(missing_ok=True)
report=json.loads((ROOT/'validation.json').read_text())
report.update({'layout':'A3 portrait colour layout, 14 native map frames',
    'names_and_population_below_shapes':True,'labels_enabled_by_default':True,
    'colour':'continuous population-based teal-to-mint','source_geopackage_unchanged':True,
    'saved_project_reopened':True,'white_panel_boxes_removed':True,
    'title_and_footnotes_centred':True,'end_note_centred_below_grid':True})
(ROOT/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2),flush=True)
project.clear()
app.exitQgis()
