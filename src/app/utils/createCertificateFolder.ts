import fs from 'fs';
import path from 'path';

const createCertificateFolder = () => {
    const projectRoot = process.cwd();
    const pdfDir = path.join(projectRoot, 'certificates');

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }
};

export default createCertificateFolder;
