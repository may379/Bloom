/**
 * Run this ONCE locally to rename all images in public/images
 * from "Spaced Names.jpg" to "kebab-case-names.jpg"
 *
 * Usage:
 *   node scripts/rename-images.js
 *
 * It will:
 *  1. Rename every file in public/images to a safe kebab-case name
 *  2. Print a mapping (old name -> new name) to rename-mapping.json
 */
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')

function toKebabCase(filename) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const kebab = base
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents (é -> e)
    .toLowerCase()
    .replace(/'/g, '')              // remove apostrophes
    .replace(/&/g, 'and')           // & -> and
    .replace(/[^a-z0-9]+/g, '-')    // everything else -> hyphen
    .replace(/^-+|-+$/g, '')        // trim leading/trailing hyphens
  return kebab + ext.toLowerCase()
}

function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ public/images directory not found at', IMAGES_DIR)
    process.exit(1)
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  const mapping = {}

  console.log(`🌸 Found ${files.length} images. Renaming...\n`)

  for (const file of files) {
    const newName = toKebabCase(file)
    const oldPath = path.join(IMAGES_DIR, file)
    const newPath = path.join(IMAGES_DIR, newName)

    if (file === newName) {
      mapping[file] = newName
      console.log(`✓  (unchanged) ${file}`)
      continue
    }

    if (fs.existsSync(newPath)) {
      console.warn(`⚠️  Skipping "${file}" — target "${newName}" already exists`)
      mapping[file] = newName
      continue
    }

    fs.renameSync(oldPath, newPath)
    mapping[file] = newName
    console.log(`✓  ${file}  →  ${newName}`)
  }

  fs.writeFileSync(
    path.join(__dirname, 'rename-mapping.json'),
    JSON.stringify(mapping, null, 2)
  )

  console.log(`\n✅ Done! Mapping saved to scripts/rename-mapping.json`)
  console.log(`   Total files processed: ${files.length}`)
}

main()
