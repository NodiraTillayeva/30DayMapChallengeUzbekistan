"""
================================================================================
Day 21: Icons - Uzbekistan Export Economy Map
PROFESSIONAL VERSION WITH CUSTOM PIN MARKERS
================================================================================

Author: Mushtariy Akhmadjonova
Date: November 21, 2025
================================================================================
"""

import folium
from folium import plugins
from folium.features import DivIcon
from datetime import datetime

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    "map_center": [41.3775, 64.5853],
    "zoom_start": 6,
    "output_html": "mushtariy_day21.html",
    "author": "Mushtariy Akhmadjonova",
    "data_year": "2023-2024",
    "geojson_url": "https://raw.githubusercontent.com/akbartus/GeoJSON-Uzbekistan/main/geojson/uzbekistan_regional.geojson"

}

# ============================================================================
# PROFESSIONAL ICON MAPPING (Font Awesome icons)
# ============================================================================

# Category colors and icons
CATEGORY_STYLES = {
    "Precious Metals": {
        "color": "#D4AF37",  # Gold color
        "icon": "gem",       # Font Awesome gem icon
        "bg": "#FFF8E7"
    },
    "Energy": {
        "color": "#E74C3C",  # Red/orange
        "icon": "fire-flame-curved",
        "bg": "#FDEDEC"
    },
    "Agriculture": {
        "color": "#27AE60",  # Green
        "icon": "leaf",
        "bg": "#E8F8F5"
    },
    "Manufacturing": {
        "color": "#8E44AD",  # Purple
        "icon": "industry",
        "bg": "#F5EEF8"
    },
    "Strategic Minerals": {
        "color": "#F39C12",  # Orange/yellow
        "icon": "atom",
        "bg": "#FEF9E7"
    },
    "Automotive": {
        "color": "#3498DB",  # Blue
        "icon": "car",
        "bg": "#EBF5FB"
    },
    "Chemicals": {
        "color": "#1ABC9C",  # Teal
        "icon": "flask",
        "bg": "#E8F6F3"
    },
}

# Specific icons for commodities (more specific than category)
COMMODITY_ICONS = {
    "Gold": "coins",
    "Copper": "cubes",
    "Uranium": "radiation",
    "Natural Gas": "fire-flame-curved",
    "LPG": "gas-pump",
    "Cotton": "cloud",
    "Textiles": "shirt",
    "Knitwear": "vest",
    "Yarn": "scroll",
    "Grapes": "wine-glass",
    "Fruits": "apple-whole",
    "Lemons": "lemon",
    "Vegetables": "carrot",
    "Vehicles": "car-side",
    "Trucks": "truck",
    "Fertilizers": "seedling",
    "Chemicals": "flask-vial",
}

# ============================================================================
# EXPORT DATA
# ============================================================================

EXPORT_LOCATIONS = [
    # GOLD & PRECIOUS METALS
    {
        "name": "Muruntau Gold Mine",
        "coords": [41.5294, 64.5714],
        "commodity": "Gold",
        "category": "Precious Metals",
        "specific_icon": "coins",
        "description": "World's largest open-pit gold mine",
        "export_value_usd": 4_500_000_000,
        "production": "66 tonnes/year",
        "export_destinations": ["Switzerland", "UAE", "UK"],
        "employment": 8000,
        "region": "Navoi",
        "source": "Navoi Mining Annual Report 2023",
        "source_url": "https://ngmk.uz/",
    },
    {
        "name": "Almalyk Mining Complex",
        "coords": [40.3667, 69.6000],
        "commodity": "Gold, Copper",
        "category": "Precious Metals",
        "specific_icon": "cubes",
        "description": "Largest multi-metal industrial complex",
        "export_value_usd": 2_100_000_000,
        "production": "Gold: 20t, Copper: 120kt/year",
        "export_destinations": ["China", "Russia", "Turkey"],
        "employment": 25000,
        "region": "Tashkent",
        "source": "AGMK Official Statistics",
        "source_url": "https://agmk.uz/",
    },
    {
        "name": "Zarafshan-Newmont JV",
        "coords": [41.5667, 64.2167],
        "commodity": "Gold",
        "category": "Precious Metals",
        "specific_icon": "gem",
        "description": "First Western mining JV in Central Asia",
        "export_value_usd": 350_000_000,
        "production": "8 tonnes/year",
        "export_destinations": ["Switzerland", "UK"],
        "employment": 1200,
        "region": "Navoi",
        "source": "Newmont Corporation",
        "source_url": "https://newmont.com/",
    },
    
    # ENERGY
    {
        "name": "Shurtan Gas Complex",
        "coords": [38.7833, 65.0833],
        "commodity": "Natural Gas",
        "category": "Energy",
        "specific_icon": "fire-flame-curved",
        "description": "Largest gas processing in Central Asia",
        "export_value_usd": 1_800_000_000,
        "production": "8.5 bcm/year",
        "export_destinations": ["China", "Russia", "Kazakhstan"],
        "employment": 5000,
        "region": "Kashkadarya",
        "source": "Uzbekneftegaz",
        "source_url": "https://ung.uz/",
    },
    {
        "name": "Gazli Gas Field",
        "coords": [40.1333, 63.4500],
        "commodity": "Natural Gas",
        "category": "Energy",
        "specific_icon": "fire",
        "description": "Historic major gas field since 1956",
        "export_value_usd": 800_000_000,
        "production": "3.2 bcm/year",
        "export_destinations": ["Russia", "Kazakhstan"],
        "employment": 2500,
        "region": "Bukhara",
        "source": "Uzbekneftegaz",
        "source_url": "https://ung.uz/",
    },
    {
        "name": "Mubarek Gas Plant",
        "coords": [39.1667, 65.2500],
        "commodity": "Natural Gas, Sulfur",
        "category": "Energy",
        "specific_icon": "bolt",
        "description": "Gas processing with sulfur recovery",
        "export_value_usd": 450_000_000,
        "production": "5 bcm gas/year",
        "export_destinations": ["China", "Afghanistan"],
        "employment": 3500,
        "region": "Kashkadarya",
        "source": "Uzbekneftegaz",
        "source_url": "https://ung.uz/",
    },
    
    # AGRICULTURE - COTTON
    {
        "name": "Fergana Valley Cotton",
        "coords": [40.3842, 71.7843],
        "commodity": "Raw Cotton",
        "category": "Agriculture",
        "specific_icon": "cloud",
        "description": "Premium long-staple cotton production",
        "export_value_usd": 600_000_000,
        "production": "800,000 tonnes/year",
        "export_destinations": ["Bangladesh", "China", "Turkey"],
        "employment": 150000,
        "region": "Fergana",
        "source": "Ministry of Agriculture",
        "source_url": "https://agro.uz/",
    },
    {
        "name": "Bukhara Cotton Region",
        "coords": [39.7747, 64.4286],
        "commodity": "Cotton, Silk",
        "category": "Agriculture",
        "specific_icon": "fan",
        "description": "Historic Silk Road cotton & silk",
        "export_value_usd": 400_000_000,
        "production": "450,000 tonnes/year",
        "export_destinations": ["Bangladesh", "Vietnam"],
        "employment": 80000,
        "region": "Bukhara",
        "source": "UN FAO",
        "source_url": "https://fao.org/",
    },
    {
        "name": "Kashkadarya Cotton",
        "coords": [38.8600, 65.8000],
        "commodity": "Cotton",
        "category": "Agriculture",
        "specific_icon": "seedling",
        "description": "Southern cotton production zone",
        "export_value_usd": 350_000_000,
        "production": "400,000 tonnes/year",
        "export_destinations": ["China", "Turkey"],
        "employment": 70000,
        "region": "Kashkadarya",
        "source": "Ministry of Agriculture",
        "source_url": "https://agro.uz/",
    },
    
    # MANUFACTURING - TEXTILES
    {
        "name": "Tashkent Textile Hub",
        "coords": [41.2995, 69.2401],
        "commodity": "Finished Textiles",
        "category": "Manufacturing",
        "specific_icon": "shirt",
        "description": "Largest textile manufacturing hub",
        "export_value_usd": 1_200_000_000,
        "production": "250 million items/year",
        "export_destinations": ["Russia", "EU", "USA"],
        "employment": 45000,
        "region": "Tashkent",
        "source": "Uztextile Association",
        "source_url": "https://textile.uz/",
    },
    {
        "name": "Namangan Textiles",
        "coords": [40.9983, 71.6726],
        "commodity": "Knitwear",
        "category": "Manufacturing",
        "specific_icon": "vest",
        "description": "Growing textile manufacturing cluster",
        "export_value_usd": 450_000_000,
        "production": "80 million items/year",
        "export_destinations": ["Russia", "Kazakhstan"],
        "employment": 25000,
        "region": "Namangan",
        "source": "Ministry of Investment",
        "source_url": "https://mift.uz/",
    },
    {
        "name": "Fergana Textile Mills",
        "coords": [40.3800, 71.7900],
        "commodity": "Cotton Yarn",
        "category": "Manufacturing",
        "specific_icon": "scroll",
        "description": "Integrated spinning and weaving",
        "export_value_usd": 280_000_000,
        "production": "150,000 tonnes/year",
        "export_destinations": ["Russia", "China"],
        "employment": 15000,
        "region": "Fergana",
        "source": "Uztextile Association",
        "source_url": "https://textile.uz/",
    },
    
    # AGRICULTURE - FRUITS
    {
        "name": "Samarkand Fruits",
        "coords": [39.6542, 66.9597],
        "commodity": "Grapes, Melons",
        "category": "Agriculture",
        "specific_icon": "wine-glass",
        "description": "World-renowned grapes and dried fruits",
        "export_value_usd": 300_000_000,
        "production": "500,000 tonnes/year",
        "export_destinations": ["Russia", "Kazakhstan", "UAE"],
        "employment": 60000,
        "region": "Samarkand",
        "source": "UN FAO FAOSTAT",
        "source_url": "https://fao.org/faostat/",
    },
    {
        "name": "Andijan Agriculture",
        "coords": [40.7821, 72.3442],
        "commodity": "Vegetables, Fruits",
        "category": "Agriculture",
        "specific_icon": "apple-whole",
        "description": "Diverse fresh produce hub",
        "export_value_usd": 250_000_000,
        "production": "400,000 tonnes/year",
        "export_destinations": ["Russia", "Kazakhstan"],
        "employment": 45000,
        "region": "Andijan",
        "source": "Ministry of Agriculture",
        "source_url": "https://agro.uz/",
    },
    {
        "name": "Surkhandarya Subtropical",
        "coords": [37.9300, 67.5700],
        "commodity": "Lemons, Pomegranates",
        "category": "Agriculture",
        "specific_icon": "lemon",
        "description": "Only subtropical zone in Uzbekistan",
        "export_value_usd": 120_000_000,
        "production": "150,000 tonnes/year",
        "export_destinations": ["Russia", "Kazakhstan"],
        "employment": 25000,
        "region": "Surkhandarya",
        "source": "Regional Statistics",
        "source_url": "https://stat.uz/",
    },
    
    # STRATEGIC MINERALS
    {
        "name": "Navoi Uranium Complex",
        "coords": [40.0844, 65.3792],
        "commodity": "Uranium",
        "category": "Strategic Minerals",
        "specific_icon": "radiation",
        "description": "7th largest uranium producer globally",
        "export_value_usd": 400_000_000,
        "production": "3,500 tonnes U/year",
        "export_destinations": ["USA", "Japan", "South Korea"],
        "employment": 8000,
        "region": "Navoi",
        "source": "World Nuclear Association",
        "source_url": "https://world-nuclear.org/",
    },
    {
        "name": "Zafarabad ISL Facility",
        "coords": [40.5500, 65.1500],
        "commodity": "Uranium",
        "category": "Strategic Minerals",
        "specific_icon": "atom",
        "description": "Modern in-situ leaching facility",
        "export_value_usd": 150_000_000,
        "production": "1,200 tonnes/year",
        "export_destinations": ["USA", "France"],
        "employment": 2000,
        "region": "Navoi",
        "source": "World Nuclear Association",
        "source_url": "https://world-nuclear.org/",
    },
    
    # AUTOMOTIVE
    {
        "name": "UzAuto Motors Asaka",
        "coords": [40.6414, 72.2378],
        "commodity": "Passenger Vehicles",
        "category": "Automotive",
        "specific_icon": "car-side",
        "description": "Largest car manufacturer in Central Asia",
        "export_value_usd": 800_000_000,
        "production": "250,000 vehicles/year",
        "export_destinations": ["Russia", "Kazakhstan", "Ukraine"],
        "employment": 12000,
        "region": "Andijan",
        "source": "UzAuto Motors",
        "source_url": "https://uzautomotors.com/",
    },
    {
        "name": "SamAuto Trucks",
        "coords": [39.6500, 66.9700],
        "commodity": "Trucks, Buses",
        "category": "Automotive",
        "specific_icon": "truck",
        "description": "Commercial vehicle assembly (MAN, ISUZU)",
        "export_value_usd": 180_000_000,
        "production": "8,000 vehicles/year",
        "export_destinations": ["Afghanistan", "Tajikistan"],
        "employment": 3000,
        "region": "Samarkand",
        "source": "SamAuto",
        "source_url": "https://samauto.uz/",
    },
    
    # CHEMICALS
    {
        "name": "Navoiyazot Fertilizers",
        "coords": [40.1000, 65.4000],
        "commodity": "Ammonia, Urea",
        "category": "Chemicals",
        "specific_icon": "flask-vial",
        "description": "Major nitrogen fertilizer producer",
        "export_value_usd": 320_000_000,
        "production": "1.2 million tonnes/year",
        "export_destinations": ["Afghanistan", "Brazil"],
        "employment": 6000,
        "region": "Navoi",
        "source": "Uzkimyosanoat",
        "source_url": "https://uzkimyosanoat.uz/",
    },
    {
        "name": "Ferganaazot",
        "coords": [40.3700, 71.8000],
        "commodity": "NPK Fertilizers",
        "category": "Chemicals",
        "specific_icon": "vial",
        "description": "Integrated fertilizer production",
        "export_value_usd": 150_000_000,
        "production": "600,000 tonnes/year",
        "export_destinations": ["Afghanistan", "Pakistan"],
        "employment": 4000,
        "region": "Fergana",
        "source": "Uzkimyosanoat",
        "source_url": "https://uzkimyosanoat.uz/",
    },
]

# Trade destinations with additional info for popups
TRADE_DESTINATIONS = {
    "China": {"coords": [39.90, 116.40], "color": "#E74C3C", "volume": "$3.2B", "main_exports": "Gas, Cotton, Textiles"},
    "Russia": {"coords": [55.75, 37.61], "color": "#3498DB", "volume": "$6.8B", "main_exports": "Vehicles, Textiles, Fruits"},
    "Turkey": {"coords": [39.93, 32.86], "color": "#E67E22", "volume": "$1.8B", "main_exports": "Cotton, Gold, Copper"},
    "Kazakhstan": {"coords": [51.16, 71.44], "color": "#9B59B6", "volume": "$3.1B", "main_exports": "Gas, Vehicles, Produce"},
    "Switzerland": {"coords": [46.95, 7.45], "color": "#F1C40F", "volume": "$2.5B", "main_exports": "Gold, Precious Metals"},
    "UAE": {"coords": [25.20, 55.27], "color": "#2ECC71", "volume": "$0.9B", "main_exports": "Gold, Fruits, Textiles"},
    "Bangladesh": {"coords": [23.81, 90.41], "color": "#1ABC9C", "volume": "$0.8B", "main_exports": "Cotton, Yarn"},
}

def create_droplet_marker(icon_name, color, bg_color):
    """Create a professional droplet/pin marker with Font Awesome icon inside"""
    return f'''
    <div style="position: relative; width: 36px; height: 46px;">
        <svg width="36" height="46" viewBox="0 0 36 46" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.3));">
            <path d="M18 0 C8 0 0 8 0 18 C0 28 18 46 18 46 C18 46 36 28 36 18 C36 8 28 0 18 0 Z" 
                  fill="{color}" stroke="white" stroke-width="2"/>
            <circle cx="18" cy="16" r="12" fill="white" opacity="0.95"/>
        </svg>
        <div style="position: absolute; 
                    top: 4px;  /* Circle y(16) - r(12) */
                    left: 6px; /* Circle x(18) - r(12) */
                    width: 24px; /* Circle diameter */
                    height: 24px; /* Circle diameter */
                    display: flex;
                    align-items: center;
                    justify-content: center;">
            <i class="fa-solid fa-{icon_name}" style="color: {color}; font-size: 14px;"></i>
        </div>
    </div>
    '''


def create_popup_html(loc):
    """Create professional popup with X button outside"""
    style = CATEGORY_STYLES.get(loc['category'], {"color": "#7F8C8D", "bg": "#F8F9FA"})
    value = f"${loc['export_value_usd']:,.0f}"
    dests = " • ".join(loc['export_destinations'][:3])
    
    return f'''
    <div style="font-family: 'Inter', 'Segoe UI', sans-serif; width: 280px; padding: 0;">
        <!-- Header with colored accent -->
        <div style="background: linear-gradient(135deg, {style['color']}15, {style['color']}30);
                    padding: 14px 16px; border-bottom: 3px solid {style['color']};">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; background: {style['color']}; border-radius: 8px;
                            display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-{loc['specific_icon']}" style="color: white; font-size: 16px;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                        {loc['name']}
                    </h3>
                    <p style="margin: 2px 0 0; color: #6c757d; font-size: 11px;">
                        {loc['region']} Region
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Stats Grid -->
        <div style="padding: 12px 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 9px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px;">
                        Export Value
                    </p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #28a745;">
                        {value}
                    </p>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 9px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px;">
                        Employment
                    </p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #495057;">
                        {loc['employment']:,}
                    </p>
                </div>
            </div>
            
            <!-- Details -->
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 6px 0; color: #6c757d; width: 35%;">Commodity</td>
                    <td style="padding: 6px 0; color: #1a1a2e; font-weight: 500;">{loc['commodity']}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #6c757d; border-top: 1px solid #eee;">Production</td>
                    <td style="padding: 6px 0; color: #1a1a2e; border-top: 1px solid #eee;">{loc['production']}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #6c757d; border-top: 1px solid #eee;">Exports to</td>
                    <td style="padding: 6px 0; color: #1a1a2e; border-top: 1px solid #eee; font-size: 10px;">{dests}</td>
                </tr>
            </table>
        </div>
        
        <!-- Description -->
        <div style="padding: 0 16px 12px;">
            <p style="margin: 0; padding: 10px; background: #f8f9fa; border-radius: 6px;
                      font-size: 11px; color: #495057; line-height: 1.5; font-style: italic;">
                "{loc['description']}"
            </p>
        </div>
        
        <!-- Source Footer -->
        <div style="padding: 10px 16px; background: #f8f9fa; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 9px; color: #6c757d;">
                <i class="fa-solid fa-database" style="margin-right: 4px;"></i>
                <a href="{loc['source_url']}" target="_blank" 
                   style="color: #007bff; text-decoration: none;">{loc['source']}</a>
                <span style="float: right; color: #adb5bd;">2023-2024</span>
            </p>
        </div>
    </div>
    '''


def create_trade_route_popup(dest_name, dest_data):
    """Create popup for trade route lines"""
    return f'''
    <div style="font-family: 'Inter', 'Segoe UI', sans-serif; width: 220px; padding: 0;">
        <div style="background: linear-gradient(135deg, {dest_data['color']}20, {dest_data['color']}40);
                    padding: 14px 16px; border-bottom: 3px solid {dest_data['color']};">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; background: {dest_data['color']}; border-radius: 8px;
                            display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-plane" style="color: white; font-size: 14px;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                        Export to {dest_name}
                    </h3>
                    <p style="margin: 2px 0 0; color: #6c757d; font-size: 11px;">
                        Trade Route
                    </p>
                </div>
            </div>
        </div>
        <div style="padding: 12px 16px;">
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                <p style="margin: 0; font-size: 9px; color: #6c757d; text-transform: uppercase;">
                    Trade Volume
                </p>
                <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #28a745;">
                    {dest_data['volume']}
                </p>
            </div>
            <p style="margin: 0; font-size: 11px; color: #6c757d;">
                <strong>Main Exports:</strong><br>
                <span style="color: #495057;">{dest_data['main_exports']}</span>
            </p>
        </div>
    </div>
    '''


def main():
    print("=" * 70)
    print("🗺️  Day 21: Icons - Uzbekistan Export Economy")
    print("    Professional Version with Custom Pin Markers")
    print("=" * 70)
    
    # Create base map
    m = folium.Map(
        location=CONFIG["map_center"],
        zoom_start=CONFIG["zoom_start"],
        tiles=None
    )
    
    # Add Font Awesome CSS
    font_awesome_css = '''
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .leaflet-popup-content-wrapper {
            padding: 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
            overflow: hidden;
        }
        .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
        }
        .leaflet-popup-close-button {
            top: -10px !important;
            right: -10px !important;
            width: 28px !important;
            height: 28px !important;
            background: white !important;
            border-radius: 50% !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            color: #333 !important;
            font-size: 16px !important;
            font-weight: bold !important;
            line-height: 28px !important;
            text-align: center !important;
            padding: 0 !important;
        }
        .leaflet-popup-close-button:hover {
            background: #f8f9fa !important;
            color: #e74c3c !important;
        }
        .leaflet-popup-tip {
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .leaflet-tooltip {
            font-family: 'Inter', sans-serif !important;
            font-size: 12px !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
            border: none !important;
        }
    </style>
    '''
    m.get_root().html.add_child(folium.Element(font_awesome_css))
    
   # Add tile layers
    folium.TileLayer('cartodbpositron', name='☀️ Light').add_to(m)
    folium.TileLayer('cartodbdark_matter', name='🌙 Dark').add_to(m)
    
    # NEW: Use Esri satellite + Carto labels for an English-only Hybrid
    folium.TileLayer(
        tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attr='Esri',
        name='🛰️ Satellite (Imagery)',
        overlay=False  # This is a base map
    ).add_to(m)
    
    folium.TileLayer(
        tiles='https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
        attr='CartoDB',
        name='🛰️ Satellite (Labels)',
        overlay=True  # This is an overlay
    ).add_to(m)
    # Add Uzbekistan boundary - NOW from a real GeoJSON
    print("🇺🇿 Adding boundary from GeoJSON URL...")
    folium.GeoJson(
        CONFIG["geojson_url"],  # <-- Use the URL from CONFIG
        style_function=lambda x: {
            'fillColor': 'transparent',
            'fillOpacity': 0,
            'color': '#34495E',
            'weight': 3,
        },
        name='🇺🇿 Uzbekistan'
    ).add_to(m)


    # Create category feature groups
    print(f"📦 Adding {len(EXPORT_LOCATIONS)} export locations...")
    categories = {}
    
    for cat, style in CATEGORY_STYLES.items():
        categories[cat] = folium.FeatureGroup(
            name=f'<i class="fa-solid fa-{style["icon"]}" style="color:{style["color"]}"></i> {cat}'
        )
        m.add_child(categories[cat])
    
    # Add markers with droplet pins
    for loc in EXPORT_LOCATIONS:
        style = CATEGORY_STYLES.get(loc['category'], {"color": "#7F8C8D"})
        
        # Create droplet marker
        marker_html = create_droplet_marker(
            loc['specific_icon'],
            style['color'],
            style.get('bg', '#ffffff')
        )
        
        # Create marker
        folium.Marker(
            location=loc['coords'],
            popup=folium.Popup(create_popup_html(loc), max_width=300),
            tooltip=folium.Tooltip(
                f"<b>{loc['name']}</b><br>"
                f"<span style='color:{style['color']}'>${loc['export_value_usd']/1e6:.0f}M</span>",
                sticky=False
            ),
            icon=DivIcon(
                icon_size=(36, 46),
                icon_anchor=(18, 46),
                html=marker_html
            )
        ).add_to(categories[loc['category']])
    
    # Add trade flow lines - NOW CLICKABLE
    print("🔄 Adding trade routes...")
    trade_group = folium.FeatureGroup(name='<i class="fa-solid fa-route" style="color:#6c757d"></i> Trade Routes')
    uz_center = [41.3, 66.5]
    
    for dest_name, dest_data in TRADE_DESTINATIONS.items():
        # Create clickable polyline with popup
        line = folium.PolyLine(
            [uz_center, dest_data['coords']],
            weight=3,
            color=dest_data['color'],
            opacity=0.6,
            dash_array='8, 6',
        )
        
        # Add popup to the line
        line.add_child(folium.Popup(
            create_trade_route_popup(dest_name, dest_data),
            max_width=250
        ))
        
        # Add tooltip
        line.add_child(folium.Tooltip(
            f"<b>🇺🇿 → {dest_name}</b><br>"
            f"<span style='color:{dest_data['color']}'>{dest_data['volume']}</span><br>"
            f"<span style='font-size:10px'>Click for details</span>",
            sticky=True
        ))
        
        line.add_to(trade_group)
        
        # Add destination marker with popup
        dest_marker = folium.CircleMarker(
            location=dest_data['coords'],
            radius=8,
            color=dest_data['color'],
            fill=True,
            fillColor=dest_data['color'],
            fillOpacity=0.8,
        )
        dest_marker.add_child(folium.Popup(
            create_trade_route_popup(dest_name, dest_data),
            max_width=250
        ))
        dest_marker.add_child(folium.Tooltip(
            f"<b>{dest_name}</b><br>{dest_data['volume']} trade volume"
        ))
        dest_marker.add_to(trade_group)
    
    trade_group.add_to(m)
    
    # Calculate statistics
    total_export = sum(loc['export_value_usd'] for loc in EXPORT_LOCATIONS)
    total_employment = sum(loc['employment'] for loc in EXPORT_LOCATIONS)
    
    cat_totals = {}
    for loc in EXPORT_LOCATIONS:
        cat_totals[loc['category']] = cat_totals.get(loc['category'], 0) + loc['export_value_usd']
    
    # Title Panel
    print("📊 Adding UI panels...")
    title_html = f'''
    <div style="position: fixed; top: 15px; left: 60px; z-index: 9999;
                background: white; padding: 18px 22px; border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.12); 
                font-family: 'Inter', sans-serif; max-width: 260px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #1abc9c, #16a085);
                        border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <i class="fa-solid fa-map-location-dot" style="color: white; font-size: 18px;"></i>
            </div>
            <div>
                <h2 style="margin: 0; color: #1a1a2e; font-size: 16px; font-weight: 700;">
                    Uzbekistan Exports
                </h2>
                <p style="margin: 2px 0 0; color: #6c757d; font-size: 11px;">
                    Day 21: Icons • #30DayMapChallenge
                </p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: #28a745;">
                    ${total_export/1e9:.1f}B
                </p>
                <p style="margin: 4px 0 0; font-size: 10px; color: #6c757d; text-transform: uppercase;">
                    Total Exports
                </p>
            </div>
            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: #495057;">
                    {len(EXPORT_LOCATIONS)}
                </p>
                <p style="margin: 4px 0 0; font-size: 10px; color: #6c757d; text-transform: uppercase;">
                    Locations
                </p>
            </div>
        </div>
    </div>
    '''
    
    # Legend Panel - FIXED: Not bold prices, wider layout for Strategic Minerals
    legend_items = ""
    for cat, total in sorted(cat_totals.items(), key=lambda x: -x[1]):
        style = CATEGORY_STYLES.get(cat, {"color": "#7F8C8D", "icon": "circle"})
        pct = (total / total_export) * 100
        legend_items += f'''
        <div style="display: flex; align-items: center; justify-content: space-between; 
                    padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <div style="width: 28px; height: 28px; background: {style['color']}15; 
                            border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fa-solid fa-{style['icon']}" style="color: {style['color']}; font-size: 12px;"></i>
                </div>
                <span style="font-size: 11px; color: #495057; white-space: nowrap;">{cat}</span>
            </div>
            <div style="text-align: right; flex-shrink: 0; margin-left: 12px;">
                <span style="font-size: 12px; font-weight: 400; color: #28a745;">${total/1e9:.1f}B</span>
                <span style="font-size: 9px; color: #adb5bd; margin-left: 4px;">({pct:.0f}%)</span>
            </div>
        </div>
        '''
    
    legend_html = f'''
    <div style="position: fixed; bottom: 25px; left: 10px; z-index: 9999;
                background: white; padding: 15px 18px; border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.12); font-family: 'Inter', sans-serif;
                min-width: 260px;">
        <h4 style="margin: 0 0 12px; font-size: 13px; font-weight: 600; color: #1a1a2e;
                   display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-layer-group" style="color: #6c757d;"></i>
            Export Categories
        </h4>
        {legend_items}
        
        <div style="display: flex; align-items: center; gap: 8px; padding: 10px 0 8px; border-bottom: 1px solid #f0f0f0;">
            <svg width="28" height="14" style="flex-shrink: 0;">
                <line x1="2" y1="7" x2="26" y2="7" stroke="#34495E" stroke-width="3"/>
            </svg>
            <span style="font-size: 11px; color: #495057;">Uzbekistan Border</span>
        </div>
        
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 10px; color: #6c757d;">
                <i class="fa-solid fa-users" style="margin-right: 4px;"></i>
                {total_employment:,} total employment
            </p>
            <p style="margin: 6px 0 0; font-size: 10px; color: #adb5bd;">
                <i class="fa-solid fa-user" style="margin-right: 4px;"></i>
                {CONFIG['author']}
            </p>
        </div>
    </div>
    '''
    
    # Data Sources Panel (compact)
    sources_html = '''
    <div style="position: fixed; bottom: 25px; right: 10px; z-index: 9998;
                background: white; padding: 12px 14px; border-radius: 10px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.1); font-family: 'Inter', sans-serif;
                max-width: 160px;">
        <h5 style="margin: 0 0 8px; font-size: 10px; font-weight: 600; color: #495057;
                   display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-database" style="color: #6c757d;"></i>
            Data Sources
        </h5>
        <div style="font-size: 9px; color: #6c757d; line-height: 1.6;">
            • State Statistics (stat.uz)<br>
            • UN Comtrade<br>
            • World Bank<br>
            • Company Reports<br>
        </div>
        <p style="margin: 8px 0 0; font-size: 8px; color: #adb5bd;">
            Data period: 2023-2024
        </p>
    </div>
    '''
    
    m.get_root().html.add_child(folium.Element(title_html))
    m.get_root().html.add_child(folium.Element(legend_html))
    m.get_root().html.add_child(folium.Element(sources_html))
    
    # Add plugins
    print("🔧 Adding controls...")
    folium.LayerControl(collapsed=False).add_to(m)
    plugins.Fullscreen(position='topleft').add_to(m)
    plugins.MiniMap(toggle_display=True, width=90, height=90).add_to(m)
    
    # Save
    m.save(CONFIG['output_html'])
    
    print("\n" + "=" * 70)
    print("✅ PROFESSIONAL MAP CREATED!")
    print("=" * 70)
    print(f"\n📁 Output: {CONFIG['output_html']}")
    print(f"📊 Locations: {len(EXPORT_LOCATIONS)} | Exports: ${total_export/1e9:.1f}B")
    print(f"\n🌐 Open '{CONFIG['output_html']}' in your browser!")
    print("=" * 70)


if __name__ == "__main__":
    main()