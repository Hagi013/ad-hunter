import moment from 'moment';

export const exportJSONFile = (obj) => {
  const link = window.document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: 'application/json' }));
  link.download = `hunted_exported_${moment().format('x')}`;
  document.body.appendChild(link);
  link.click();
  console.log(`link: ${link}`);
};

export const importJSONFile = (obj) => { console.log(obj); };
