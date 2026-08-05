import * as path from 'node:path'
import * as os from 'node:os'
import fs from 'fs'

const OUTPUT_DATA_FILE = path.join(__dirname, '..', 'OUTPUT.txt')

export default (key: string, value: string) => {
    fs.appendFileSync(OUTPUT_DATA_FILE, `${key}=${value}${os.EOL}`)
}
