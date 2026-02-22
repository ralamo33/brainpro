import Image from "next/image";

export function GameFace({ filePath }: { filePath: string }) {
    const bucketName = "brain_pro_faces";
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
    return <Image src={imageUrl} width={178} height={200} alt="human face" />;
}
