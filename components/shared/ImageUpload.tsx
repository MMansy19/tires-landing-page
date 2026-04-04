'use client';

import { useState } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import Image from 'next/image';
import { ImagePlus, Loader2, X } from 'lucide-react';

const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || '';

const authenticator = async () => {
  const response = await fetch('/api/imagekit/auth');
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  return { signature: data.signature, expire: data.expire, token: data.token };
};

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, onRemove, folder = 'gresco' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
        <div className="flex flex-col items-center justify-center gap-4">
          {value ? (
            <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-md">
              <Image src={value} alt="معاينة" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  onRemove?.();
                }}
                className="absolute top-2 end-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                <ImagePlus size={32} />
              </div>
              <div>
                <p className="text-slate-600 font-medium mb-1">اضغط لرفع صورة</p>
                <p className="text-slate-400 text-sm">JPG, PNG, WEBP حتى 5MB</p>
              </div>
              <IKUpload
                fileName="upload"
                folder={`/${folder}`}
                onError={(err: { message: string }) => {
                  console.error('Upload error:', err);
                  setIsUploading(false);
                }}
                onSuccess={(res: { url: string }) => {
                  onChange(res.url);
                  setIsUploading(false);
                }}
                onUploadStart={() => setIsUploading(true)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
              <div className="flex items-center gap-3 text-accent font-medium">
                <Loader2 className="animate-spin" size={24} />
                جاري الرفع...
              </div>
            </div>
          )}
        </div>
      </IKContext>
    </div>
  );
}
