import PDFParser from "pdf2json";

export const getPdfText = async (file: Buffer) =>
    await new Promise<string>((resolve, reject) => {
        const pdf = new PDFParser()
        const textContent: Array<string> = []
        pdf.on('data', async page => {
            if (page == null) {
                resolve(textContent.join()) // all pages parsed, return the content
            } else {
                textContent.push(...page.Texts.flatMap(t => t.R).map(t => t.T)) // new page, add text content to array
            }
        })
        pdf.on('pdfParser_dataError', reject)
        pdf.parseBuffer(file)
    })
