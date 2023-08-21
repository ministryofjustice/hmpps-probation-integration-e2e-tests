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
