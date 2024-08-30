import * as fs from 'fs';
import axios from 'axios';
import { spawn } from 'child_process';

async function getLinks(url) {
    const currentUrl = url;

    try {
      const response = await axios.get(url, { responseType: 'json' });
      let fileLinks = [];
      let promises = [];

      for (const element of response.data) {
        const name = element.name;
        const newUrl = `${currentUrl}${name}`;

        if (element.type === 'directory') {
          console.log('D', element);
          promises.push(this.getLinks(newUrl));
        } else if (element.type === 'file' && element.size > 0) {
          console.log('F', element.name, element.size);
          fileLinks.push(newUrl);
        }
      }

      const nestedLinks = await Promise.all(promises);
      nestedLinks.forEach(links => {
        fileLinks = fileLinks.concat(links);
      });

      return fileLinks;
    } catch (error) {
      console.error('Ошибка получения ссылок:', error);
      return [];
    }
}

async function downloadFile(link) {
    console.log(link)
    const response = await axios.get(link, { responseType: 'stream' });
    const name = link.split('/').pop()
    console.log(name)
    const file = fs.createWriteStream(name);

    response.data.pipe(file);

    return new Promise((resolve, reject) => {
        file.on('finish', resolve);
        file.on('error', reject);
    });
}

fs.readdir('/', function(err, data) {
	if (!err) {
		console.log(`Data:${[data]}`);
	} else {
		console.log(err);
	}
});

const links = await getLinks('https://store.neuro-city.ru/downloads/for-test-tasks/files-list/')
console.log(links)

const promises = links.map(async (link) => {
    downloadFile(link)
});

await Promise.all(promises);


let terminal;

if (process.platform === 'win32') {
    terminal = spawn('cmd.exe', ['/k', 'echo Hello, World! & pause'], {
        detached: true,
        shell: true
    });
} else if (process.platform === 'darwin') {
    terminal = spawn('osascript', ['-e', 'tell application "Terminal" to do script "echo Hello, World!; read"']);
} else {
    terminal = spawn('gnome-terminal', ['--', 'bash', '-c', 'echo Hello, World!; exec bash'], {
        detached: true
    });
}

terminal.on('error', (err) => {
    console.error('Ошибка при запуске терминала:', err);
});
