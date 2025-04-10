export const convertBase64ToImageUri = (base64String: string, format: 'jpeg' | 'png' = 'jpeg') => {
    return `data:image/${format};base64,${base64String}`;
  };
  