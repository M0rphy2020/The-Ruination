# The Ruination Installer Assets

This folder contains custom branding images for the NSIS installer.

## Required Images

The vector reference artwork is branded. The two bitmap files below still need to be regenerated from the supplied Ruination logo before a release is considered visually complete:

### 1. **installer-sidebar.bmp** (Left Side Panel)
- **Resolution**: 164 x 314 pixels
- **Format**: BMP (24-bit)
- **Usage**: Displayed on the left side of the installer during all steps
- **Design Tips**:
  - Use dark background (#05090B or similar)
  - Include the Ruination logo/branding vertically centered
  - Keep important content in the center (top/bottom may be cut off)

### 2. **installer-header.bmp** (Top Banner)
- **Resolution**: 150 x 57 pixels
- **Format**: BMP (24-bit)
- **Usage**: Displayed as the header banner at the top of installer pages
- **Design Tips**:
  - Use dark background to match sidebar
  - Small Ruination logo or text
  - Keep text/logo on the left side (header image is right-aligned)

### 3. **Icon** (Already exists)
- **File**: `icons/icon.ico`
- **Usage**: Installer icon, uninstaller icon, shortcuts
- **Note**: This is already configured and uses the current application icon

### 4. **Logo SVG** (For reference)
- **Files**:
  - `ruination-logo.svg` - Monochrome version (light on dark)
  - `ruination-logo-colored.svg` - Colored version (cyan fractured sigil)
- **Usage**: Reference for creating installer graphics
- **Note**: Use these as a basis for your custom BMP images

## Current Status

🔴 **PLACEHOLDER FILES** - Replace these with your custom images before building the installer!

## How to Create BMP Files

### Using Photoshop/GIMP:
1. Create new image with exact dimensions above
2. Design your installer graphics (dark theme recommended)
3. Save as **BMP** format
4. Select **24-bit** color depth
5. Save to this folder with exact filenames

### Using Online Tools:
- [Photopea](https://www.photopea.com/) - Free online Photoshop alternative
- [Paint.NET](https://www.getpaint.net/) - Free Windows image editor

## Color Palette (Dark Theme)

- **Background**: #05090B (dark gray)
- **Text**: #C7D6D8 (light gray)
- **Accent**: Turquoise cyan (#20DDE0)
- **Logo**: Use the Ruination logo/icon

## Testing

After regenerating both bitmap assets:
1. Build the installer: `npm run tauri build`
2. Run the installer to preview your branding
3. Adjust images if needed and rebuild

## Notes

- BMP format is required by NSIS (PNG/JPG won't work)
- Images MUST be exactly the specified dimensions
- Use 24-bit color depth (no transparency needed)
- Dark theme colors are configured in `nsis/installer.nsi`
