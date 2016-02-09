import fs from 'fs';
import path from 'path';

const SIDEBYSIDE_CONFIG_NAME = '.iget';

export default {
    defaults: {
        defaultKeysLanguage: 'en',
        languages: ['en'],
        lang: 'en'
    },
    fetchSideBySide() {

        const configPath = path.join(process.cwd(), SIDEBYSIDE_CONFIG_NAME);

        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath);
            try {
                return JSON.parse(content);
            } catch (err) {
                throw new Error(`failed to parse ${configPath}: ${err.toString()}`);
            }
        }
    },
    fetchPackageJson() {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            return require(packageJsonPath).iget;
        }
    }
};