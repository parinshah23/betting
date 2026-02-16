import PDFDocument from 'pdfkit';

export interface CertificateData {
    userName: string;
    competitionTitle: string;
    prizeValue: number;
    ticketNumber: number;
    wonDate: Date;
}

class CertificateService {
    /**
     * Generate PDF certificate for winner
     */
    async generateCertificate(data: CertificateData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const chunks: Buffer[] = [];

                doc.on('data', (chunk: Buffer) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Background color bar at top
                doc.rect(0, 0, 842, 8).fill('#2563EB');

                doc.moveDown(2);

                // Header
                doc.fontSize(36)
                    .font('Helvetica-Bold')
                    .fillColor('#1F2937')
                    .text('WINNER CERTIFICATE', { align: 'center' });

                doc.moveDown(1);

                // Decorative line
                const centerX = 842 / 2;
                doc.moveTo(centerX - 200, doc.y)
                    .lineTo(centerX + 200, doc.y)
                    .lineWidth(2)
                    .strokeColor('#2563EB')
                    .stroke();

                doc.moveDown(1.5);

                // "This certifies that" text
                doc.fontSize(16)
                    .font('Helvetica')
                    .fillColor('#6B7280')
                    .text('This certifies that', { align: 'center' });

                doc.moveDown(0.5);

                // Winner name
                doc.fontSize(32)
                    .font('Helvetica-Bold')
                    .fillColor('#111827')
                    .text(data.userName, { align: 'center' });

                doc.moveDown(1);

                // "has won" text
                doc.fontSize(16)
                    .font('Helvetica')
                    .fillColor('#6B7280')
                    .text('has won', { align: 'center' });

                doc.moveDown(0.5);

                // Prize title
                doc.fontSize(26)
                    .font('Helvetica-Bold')
                    .fillColor('#2563EB')
                    .text(data.competitionTitle, { align: 'center' });

                doc.moveDown(1);

                // Prize value
                doc.fontSize(20)
                    .font('Helvetica')
                    .fillColor('#111827')
                    .text(`Prize Value: £${data.prizeValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, { align: 'center' });

                doc.moveDown(1.5);

                // Details section
                doc.fontSize(14)
                    .font('Helvetica')
                    .fillColor('#4B5563')
                    .text(`Winning Ticket Number: #${data.ticketNumber}`, { align: 'center' });

                doc.moveDown(0.3);

                doc.text(`Date Won: ${data.wonDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}`, { align: 'center' });

                doc.moveDown(2);

                // Bottom decorative line
                doc.moveTo(centerX - 200, doc.y)
                    .lineTo(centerX + 200, doc.y)
                    .lineWidth(2)
                    .strokeColor('#2563EB')
                    .stroke();

                doc.moveDown(0.5);

                // Certificate ID
                doc.fontSize(9)
                    .font('Helvetica')
                    .fillColor('#9CA3AF')
                    .text(`Certificate ID: CERT-${Date.now()}-${data.ticketNumber}`, { align: 'center' });

                // Bottom color bar
                doc.rect(0, 595 - 8, 842, 8).fill('#2563EB');

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new CertificateService();
