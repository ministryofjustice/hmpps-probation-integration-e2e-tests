import PDFParser, { Output } from 'pdf2json'

export const getPdfText = async (file: Buffer) => {
    return await new Promise<string>((resolve, reject) => {
        const pdf = new PDFParser()
        pdf.on('pdfParser_dataReady', pdfData => resolve(mapToText(pdfData)))
        pdf.on('pdfParser_dataError', reject)
        pdf.parseBuffer(file)
    })
}

function mapToText(pdfData: Output) {
    return pdfData.Pages.flatMap(p => p.Texts)
        .flatMap(t => t.R)
        .map(t => t.T)
        .join('')
}

// Some PDF fonts cause pdf2json to split glyphs into separate runs padded with spaces (e.g. "C ross Lane"),
// so strip all whitespace before comparing extracted text.
export const removeWhitespace = (text: string) => text.replace(/\s+/g, '')
