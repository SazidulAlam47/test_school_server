import { TLevel } from '../modules/question/question.interface';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateCertificatePdf = (
    name: string,
    certifiedLevel: TLevel,
    issuedAt: Date,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const projectRoot = process.cwd();
            const certificatesDir = path.join(projectRoot, 'certificates');

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `certificate_${sanitizedName}_${certifiedLevel}_${timestamp}.pdf`;
            const filePath = path.join(certificatesDir, filename);

            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 50,
            });

            doc.pipe(fs.createWriteStream(filePath));

            doc.on('end', () => {
                const relativePath = path.relative(projectRoot, filePath);
                resolve(`/${relativePath.replace(/\\/g, '/')}`);
            });

            doc.on('error', (error) => {
                reject(error);
            });

            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
                .stroke('#2c3e50')
                .lineWidth(3);

            doc.fillColor('#2c3e50')
                .fontSize(36)
                .font('Helvetica-Bold')
                .text('CERTIFICATE OF ACHIEVEMENT', 0, 120, {
                    align: 'center',
                    width: doc.page.width,
                });

            doc.fontSize(18)
                .font('Helvetica')
                .text('This is to certify that', 0, 180, {
                    align: 'center',
                    width: doc.page.width,
                });

            doc.fillColor('#34495e')
                .fontSize(32)
                .font('Helvetica-Bold')
                .text(name, 0, 220, {
                    align: 'center',
                    width: doc.page.width,
                });

            doc.fillColor('#2c3e50')
                .fontSize(18)
                .font('Helvetica')
                .text(
                    `has successfully completed the Digital Competency Assessment`,
                    0,
                    280,
                    {
                        align: 'center',
                        width: doc.page.width,
                    },
                );

            doc.fontSize(24)
                .font('Helvetica-Bold')
                .fillColor('#e74c3c')
                .text(`Level ${certifiedLevel}`, 0, 320, {
                    align: 'center',
                    width: doc.page.width,
                });

            const currentDate = issuedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            doc.fillColor('#7f8c8d')
                .fontSize(14)
                .font('Helvetica')
                .text(`Issued on: ${currentDate}`, 0, 380, {
                    align: 'center',
                    width: doc.page.width,
                });

            doc.moveTo(100, 200)
                .lineTo(200, 200)
                .stroke('#e74c3c')
                .lineWidth(2);

            doc.moveTo(doc.page.width - 200, 200)
                .lineTo(doc.page.width - 100, 200)
                .stroke('#e74c3c')
                .lineWidth(2);

            doc.fillColor('#2c3e50')
                .fontSize(12)
                .font('Helvetica')
                .text(
                    'Test School Authority',
                    doc.page.width - 200,
                    doc.page.height - 100,
                    {
                        align: 'center',
                        width: 150,
                    },
                );

            doc.moveTo(doc.page.width - 200, doc.page.height - 110)
                .lineTo(doc.page.width - 50, doc.page.height - 110)
                .stroke('#2c3e50')
                .lineWidth(1);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default generateCertificatePdf;
