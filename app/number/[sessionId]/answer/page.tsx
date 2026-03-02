import { AnswerClient } from "./AnswerClient";

type Props = {
    params: Promise<{ sessionId: string }>;
};

export default async function NumberAnswerPage({ params }: Props) {
    const { sessionId } = await params;
    return <AnswerClient sessionId={sessionId} />;
}
