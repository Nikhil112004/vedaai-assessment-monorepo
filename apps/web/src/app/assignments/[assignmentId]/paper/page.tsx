import { QuestionPaperPage } from '@/features/question-paper/components/question-paper-page';

type QuestionPaperRouteProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export default async function QuestionPaperRoute({ params }: QuestionPaperRouteProps) {
  const { assignmentId } = await params;
  return <QuestionPaperPage assignmentId={assignmentId} />;
}
