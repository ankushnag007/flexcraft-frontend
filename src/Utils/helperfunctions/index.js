import {colors} from '../../global/theme/Theme';

export const getPickerImageResp = res => {
  const respArr = res.assets;
  const imgResp = Array.isArray(respArr) && respArr.length ? respArr[0] : null;

  if (imgResp) {
    return {
      uri: imgResp?.uri,
      name: imgResp?.fileName,
      type: imgResp?.type,
    };
  }

  return false;
};

export const icon_color = theme => {
  const color = theme === 'dark' ? colors.black : colors.white;
  return color;
};

export const getbgColor = status => {
  if (status == 'Pending') {
    return 'orange';
  }
  if (status == 'New') {
    return 'blue';
  }
  if (status == 'Done') {
    return 'green';
  }
  if (status == 'Critical') {
    return 'red';
  }
};


export const getLabelColor = status => {
  if (status == 'danger') {
    return '#d9534f';
  }
  if (status == 'warning') {
    return '#f0ad4e';
  }
  if (status == 'info') {
    return '#5bc0de';
  }
  if (status == 'success') {
    return '#5cb85c';
  }
  if(status == 'primary'){
    return '#337ab7'
  }
  if(status == 'default'){
    return '#777'
  }
};

