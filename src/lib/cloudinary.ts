const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const isCloudinaryReady = (): boolean => !!(cloudName && uploadPreset);

export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary이 설정되지 않았습니다.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `업로드 실패 (${res.status})`);
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
};
