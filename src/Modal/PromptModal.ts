import { App, Modal, Setting } from 'obsidian';

export class PromptModal extends Modal {

    title: string;
    onSubmit: (result: string) => void;
  
    constructor(app: App, title: string, onSubmit: (result: string) => void) {
      super(app);
      this.title = title;
      this.onSubmit = onSubmit;
    }
  
    onOpen() {
      const { contentEl } = this;
  
      contentEl.createEl('h2', { text: this.title });
  
      let inputValue = '';
  
      new Setting(contentEl).addText((text) =>
        text.onChange((value) => {
          inputValue = value;
        })
      );
  
      new Setting(contentEl)
        .addButton((btn) =>
          btn
            .setButtonText('OK')
            .setCta()
            .onClick(() => {
              this.close();
              this.onSubmit(inputValue);
            })
        )
        .addButton((btn) =>
          btn.setButtonText('Cancel').onClick(() => {
            this.close();
            this.onSubmit('');
          })
        );
    }
  
    onClose() {
      const { contentEl } = this;
      contentEl.empty();
    }
  }
  