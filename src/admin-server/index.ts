import staticServer from 'node-static';
import http from 'http';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { Server, Socket } from 'socket.io';
import dataSource from '../database/dataSource';
import { factoryReset, reboot } from '../electron/windowUtilities';
import path from 'path';

export class AdminServer {
  private rebootRequired: boolean;
  constructor() {
    const staticFileServer = new staticServer.Server(__dirname + '/../renderer/', {
      cache: false,
      indexFile: 'main_window/index.html'
    });
    const server = http.createServer(function(req, res) {
      if (req.url == '/fileupload') {
        const form = new IncomingForm({
          filename: () => 'user-uploaded-database.sqlite',
          uploadDir: path.join(__dirname, '../../'),
          maxFiles: 1
        });
        form.parse(req, function(err, fields, files) {
          if (err) throw err;
          dataSource.destroy().then(() => {
            fs.rename('user-uploaded-database.sqlite', 'database.sqlite', (err) => {
              if (err) throw err;
              res.write('System restored from backup. Please now check the device has initiated correctly');
              res.end();
              reboot(true);
            });
          });
        });
      } else {
        staticFileServer.serve(req, res, function (e: Error) {
            if (e) {
                if (e.message == "Not Found") {
                  staticFileServer.serveFile('/main_window/index.html', 200, {}, req, res);
                } else {
                  res.writeHead(500, {'Content-Type': 'text/html'});
                  res.write(e.message);
                  res.end();
                }
            }
        });
      }
    });
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    server.listen(80)
    /*
    // Socket.io admin site
    io.on('connection', (socket) => {
      this.sendDataToAdminPortal(socket); // send information from tables to populate admin connected
      socket.on('updateConfig', this.updateConfig); // update config when something received from site
      
      // update preset when received from admin site
      socket.on('updatePreset', async (table, data) => {
        if (['LXPreset', 'SNDPreset', 'SNDFaders', 'lxPresetFolders'].includes(table)) {
          // rearrange received data for database formatting
          datas = {};
          for (const [key, value] of Object.entries(data)) {
            if (value.value == 'null') {
              datas[value.name] = null;
            } else {
              datas[value.name] = value.value;
            }
          }
          if (datas.id == null) {
            // new preset
            await knex(table).insert(datas);
          } else {
            // update preset
            await knex.table(table).where({id: (datas.id)}).update(datas);
          }
          requireReboot(socket);
        }
      });
      // remove preset
      socket.on('removePreset', async (table, data) => {
        if (['LXPreset', 'SNDPreset', 'lxPresetFolders'].includes(table)) {
          // remove
          await knex(table).where({id: data.id}).del();

          requireReboot(socket);
        }
      });

      // Lock mechanism
      socket.on('lock', async () => {
        await toggleLock();
      });
      // Sampling system for e131
      socket.on('e131sampler', async () => {
        reboot(true, true, ['--e131sampler'], []);
      });
      // Factory Reset
      socket.on('factoryReset', function() {
        factoryReset();
      });
      // Reboot Reset
      socket.on('reboot', function() {
        reboot(true);
      });

      socket.on('disconnect', (reason: string) => {
        console.log('Disconnected: ' + reason);
      });
    });
    
  }
  sendDataToAdminPortal(socket: Socket) {
    knex.select().table('sndConfig').then((data) => {
      socket.emit('config', {'SNDConfig': data} );
    });
    knex.select().table('lxConfig').then((data) => {
      socket.emit('config', {'LXConfig': data} );
    });
    knex.select().table('config').then((data) => {
      socket.emit('config', {'config': data} );
    });
    knex.select().table('lxPresetFolders').then((folders) => {
      socket.emit('folder', {'lxPresetFolders': folders} );
    });
    knex.select().table('lxPresetFolders').then((folders) => {
      knex.select().table('lxPreset').then((presets) => {
        socket.emit('preset', {'LXPreset': {'folders': folders, 'presets': presets}} );
      });
    });
    knex.select().table('sndPreset').then((data) => {
      socket.emit('preset', {'SNDPreset': data});
    });
    knex.select().table('sndFaders').then((data) => {
      socket.emit('fader', {'SNDFader': data});
    });
  
    socket.emit('about', {
      'npmVersions': process.versions,
      'version': 'v2'
    });
  
    socket.emit('rebootRequired', this.rebootRequired);
  }
  async updateConfig(
    table: string,
    data: object,
    socket: Socket
  ) {
    console.log(table);
    console.log(data);
    console.log(socket);
    /*
    if (['config', 'LXConfig', 'SNDConfig'].includes(table)) {
      for (const [key, value] of Object.entries(data)) {
        //await knex(table).where({key: value.name}).update({value: value.value});
      }
      // reboot to update settings on controller
      requireReboot(socket);
    }
      */
  }

}