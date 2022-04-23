import { MigrationInterface, QueryRunner } from "typeorm";
import { Config } from "../model/Config";
import { LxConfig } from "../model/LxConfig";
import { SndConfig } from "../model/SndConfig";
/**
 * Generate default config - it will fail if config already exists (which is fine)
 */
export class InsertConfig1650710286405 implements MigrationInterface {
    name = 'InsertConfig1650710286405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.insert(LxConfig, {key: 'e131FirstUniverse', value: '1', name: 'First Universe'})
            await queryRunner.manager.insert(LxConfig, {key: 'e131Universes', value: '2', name: 'Number of Universes', description: ''});
            await queryRunner.manager.insert(LxConfig, {key: 'e131SourceName', value: 'Paradise Pi', name: 'sACN Source Name', description: ''});
            await queryRunner.manager.insert(LxConfig, {key: 'e131Priority', value: '25', name: 'sACN Priority', description: 'Higher values take precedence'});
            await queryRunner.manager.insert(LxConfig, {key: 'e131Frequency', value: '5', name: 'Refresh Rate', description: '', canEdit: false});
            await queryRunner.manager.insert(LxConfig, {key: 'fadeTime', value: '5', name: 'Preset Fade Time', description: 'Delay time to fade presets in (seconds). 0 = Instant', canEdit: true});
            await queryRunner.manager.insert(LxConfig, {key: 'e131Sampler_time', value: '15', name: 'Sampler Mode run time', description: 'How long should sampler mode sample for (in seconds)', canEdit: true});
            await queryRunner.manager.insert(LxConfig, {key: 'e131Sampler_effectMode', value: '0', name: 'Sampler Mode effect mode enable', description: 'Set to 1 to store values that are varying when in sample mode, they are normally discarded otherwise', canEdit: true});
        
            await queryRunner.manager.insert(SndConfig, {key: 'targetIP', value: '192.168.1.1', name: 'OSC Target IP', description: ''});
            await queryRunner.manager.insert(SndConfig, {key: 'mixer', value: 'xair', name: 'Console Type', description: 'Which console?', options: '["xair","x32"]'});
        
            await queryRunner.manager.insert(Config, {key: 'deviceLock', value: 'UNLOCKED', name: 'Device Lock', description: 'Lock the device', canEdit: false});
            await queryRunner.manager.insert(Config, {key: 'timeoutTime', value: '5', name: 'Device Timeout', description: 'How soon should the device be blanked after last interaction (minutes)'});
            await queryRunner.manager.insert(Config, {key: 'LXInfo', value: '', name: 'LX Additional Info', description: 'Additional Information for the Lighting page'});
            await queryRunner.manager.insert(Config, {key: 'SNDInfo', value: '', name: 'SND Additional Info', description: 'Additional Information for the Sound page'});
            await queryRunner.manager.insert(Config, {key: 'LXEnabled', value: 'true', name: 'Lighting Page', description: 'Show Lighting Page', options: '["Show","Hide"]'});
            await queryRunner.manager.insert(Config, {key: 'LXAdditonalMenu', value: 'true', name: 'Lighting Special Functions', description: 'Show additional Lighting options such as channel check and keypad', options: '["Show", "Hide"]'});
            await queryRunner.manager.insert(Config, {key: 'SNDEnabled', value: 'true', name: 'Sound Page', description: 'Show Sound Page', options: '["Show","Hide"]'});
            await queryRunner.manager.insert(Config, {key: 'AdminEnabled', value: 'true', name: 'Admin Page', description: 'Show Admin Page', options: '["Show","Hide"]'});

            // commit transaction now:
            await queryRunner.commitTransaction();
            
        } catch (err) {
            
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            
        } finally {
            
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Not much need to roll this one back
    }

}
