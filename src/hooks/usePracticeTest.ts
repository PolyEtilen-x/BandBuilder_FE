import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { practiceApi } from "@/api/practice/practice.api";
import { useMemo } from "react";
import { PracticeTestDTO } from "@/data/practices/practice.types";

export const usePracticeTest = () => {
  const { id, skill } = useParams<{ id: string; skill: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const mode = (location.state?.mode as "exam" | "practice") || "practice";
  const rawUnit = searchParams.get("unit");
  const unitNumber = rawUnit === "full" ? null : Number(rawUnit || 1);

  const isWriting = skill?.toLowerCase() === "writing";
  const isSpeaking = skill?.toLowerCase() === "speaking";

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["practice-test", id, skill, unitNumber],
    queryFn: async () => {
      if (!id) throw new Error("Test ID is required");
      const res = await practiceApi.getTestSessionContent(id);

      let skillItem: any;

      if (isWriting) {
        // Writing has 2 separate SkillTest entries — match by content.task
        skillItem = res.data.skills?.find(
          (s: any) =>
            s.skillType?.toLowerCase() === "writing" &&
            (s.content?.task === unitNumber || unitNumber === null)
        );
        // Fallback: first writing skill
        if (!skillItem) {
          skillItem = res.data.skills?.find(
            (s: any) => s.skillType?.toLowerCase() === "writing"
          );
        }
      } else {
        skillItem = res.data.skills?.find(
          (s: any) => s.skillType?.toLowerCase() === skill?.toLowerCase()
        );
      }

      if (!skillItem) {
        throw new Error(`Skill "${skill}" not found in this test session`);
      }

      return {
        ...res.data,
        skillContentId: skillItem.skillContentId,
        audioUrl: skillItem.audioUrl,
        source: skillItem.source,
        content: skillItem.content,
        taskNumber: isWriting ? (skillItem.content?.task as 1 | 2 | undefined) : undefined,
      } as PracticeTestDTO & { taskNumber?: 1 | 2; skillContentId?: string };
    },
    enabled: !!id && !!skill,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentUnit = useMemo(() => {
    if (!test) return null;

    // Writing or Speaking: the content itself IS the unit (flat object with prompt, instruction, etc.)
    if ((isWriting || isSpeaking) && test.content) {
      return test.content as any;
    }

    const isReading = !!test.content?.passages;
    const isListening = !!test.content?.sections;

    if (isReading && test.content.passages) {
      return (
        test.content.passages.find((p: any) => p.passage_number === unitNumber) ||
        test.content.passages[0]
      );
    }

    if (isListening && test.content.sections) {
      return (
        test.content.sections.find((s: any) => s.section === unitNumber) ||
        test.content.sections[0]
      );
    }

    return null;
  }, [test, unitNumber, isWriting, isSpeaking]);

  return {
    test,
    currentUnit,
    isLoading,
    error,
    mode,
    id,
    unitNumber,
    isWriting,
    isSpeaking,
    skillContentId: test?.skillContentId,
  };
};

