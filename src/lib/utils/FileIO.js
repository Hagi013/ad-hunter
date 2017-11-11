import moment from 'moment';

export const exportJSONFile = (obj) => {
  const link = window.document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: 'application/json' }));
  link.download = `hunted_exported_${moment().format('x')}`;
  document.body.appendChild(link);
  link.click();
  console.log(`link: ${link}`);
};

export const importJSONFile = file => new Promise((resolved, rejected) => {
  const reader = new FileReader();
  reader.onload = (loadedFile) => {
    try {
      const obj = JSON.parse(loadedFile.target.result);
      resolved(obj);
    } catch (e) {
      console.error(e);
      rejected();
    }
  };
  reader.readAsText(file);
});
