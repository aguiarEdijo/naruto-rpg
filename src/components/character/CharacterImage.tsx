import React, { useState } from 'react';
import Image from 'next/image';
import { Character } from '@/lib/gameConstants';
import { Button } from '@/components/ui';

interface CharacterImageProps {
    character: Character;
    onImageUpdate: (imageUrl: string | null) => void;
}

export const CharacterImage: React.FC<CharacterImageProps> = ({
    character,
    onImageUpdate
}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [characterImage, setCharacterImage] = useState<string | null>(null);

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (url.trim()) {
            setCharacterImage(url);
            onImageUpdate(url);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCharacterImage(result);
                onImageUpdate(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCharacterImage(null);
        setImageUrl('');
        onImageUpdate(null);
    };

    return (
        <div className="w-full min-h-[500px] flex items-center justify-center">
            {characterImage ? (
                <div className="relative w-full h-[500px]">
                    <Image
                        src={characterImage}
                        alt="Personagem"
                        fill
                        className="object-cover rounded-lg border-2 border-primary shadow-lg"
                    />
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={removeImage}
                        disabled={!character.isEditable}
                        className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                    >
                        ×
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center hover:border-accent transition-colors w-full h-[500px] flex flex-col justify-center bg-white/50">
                    <div className="mb-3">
                        <svg className="mx-auto h-12 w-12 text-primary" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="url"
                            placeholder="Cole a URL da imagem aqui"
                            value={imageUrl}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-gray-800"
                            disabled={!character.isEditable}
                        />
                        <div className="text-xs text-gray-600">ou</div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#7A8B7B] file:text-white hover:file:bg-[#7C9BA6]"
                            disabled={!character.isEditable}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                        Formatos: JPG, PNG, GIF (máx. 2MB)
                    </p>
                </div>
            )}
        </div>
    );
};
