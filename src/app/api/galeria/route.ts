import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), 'public', 'galeria');
    
    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json({ items: [] });
    }
    
    const files = fs.readdirSync(galleryDir);
    
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm', '.ogg', '.mov'].includes(ext);
    });
    
    const items = mediaFiles.map((file) => {
      const ext = path.extname(file).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
      const baseName = path.basename(file, ext);
      
      let title = baseName.replace(/[-_]/g, ' ');
      let category = isVideo ? 'Video' : 'Foto';
      
      if (title.includes('  ')) {
        title = title.replace(/\s+/g, ' ');
      }
      
      title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      return {
        title: title,
        category: category,
        src: `/galeria/${file}`
      };
    });
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return NextResponse.json({ error: 'Failed to read gallery items' }, { status: 500 });
  }
}
