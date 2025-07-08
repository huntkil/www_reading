export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  estimatedReadingTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  book: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  totalChapters: number;
  totalWordCount: number;
  estimatedTotalTime: number; // in minutes
}

// Parse markdown content from reading_materials.md
function parseMarkdownIntoChapters(content: string, bookId: string, bookTitle: string): Chapter[] {
  const chapters: Chapter[] = [];
  const chapterBlocks = content.split(/CHAPTER [IVXLCDM]+\./).slice(1); // Split by "CHAPTER X."

  chapterBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    if (lines.length < 2) return;

    const title = lines[0].trim();
    const chapterContent = lines.slice(1).join('\n').trim();
    const wordCount = chapterContent.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200);

    if (title && chapterContent) {
      chapters.push({
        id: `${bookId}-${index + 1}`,
        title: title,
        content: chapterContent,
        wordCount: wordCount,
        estimatedReadingTime: estimatedReadingTime,
        difficulty: wordCount > 1500 ? 'advanced' : wordCount > 800 ? 'intermediate' : 'beginner',
        book: bookTitle,
      });
    }
  });

  return chapters;
}

// Parse readming_materials2.md format (numbered topics)
function parseNumberedTopics(content: string, bookId: string, bookTitle: string): Chapter[] {
  const chapters: Chapter[] = [];
  const lines = content.split('\n');
  let currentChapter: Partial<Chapter> | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check for chapter headers (## followed by numbered topics)
    const chapterMatch = line.match(/^##\s+[①②③④]\s+(.+)$/);
    if (chapterMatch) {
      // Save previous chapter if exists
      if (currentChapter && currentContent.length > 0) {
        const content = currentContent.join('\n').trim();
        const wordCount = content.split(/\s+/).length;
        const estimatedReadingTime = Math.ceil(wordCount / 200);
        
        chapters.push({
          id: `${bookId}-${chapters.length + 1}`,
          title: currentChapter.title!,
          content,
          wordCount,
          estimatedReadingTime,
          difficulty: wordCount > 500 ? 'advanced' : wordCount > 300 ? 'intermediate' : 'beginner',
          book: bookTitle
        });
      }

      // Start new chapter
      currentChapter = { title: chapterMatch[1].trim() };
      currentContent = [];
    } else if (currentChapter && line.trim() && !line.startsWith('#')) {
      currentContent.push(line);
    }
  }

  // Add the last chapter
  if (currentChapter && currentContent.length > 0) {
    const content = currentContent.join('\n').trim();
    const wordCount = content.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200);
    
    chapters.push({
      id: `${bookId}-${chapters.length + 1}`,
      title: currentChapter.title!,
      content,
      wordCount,
      estimatedReadingTime,
      difficulty: wordCount > 500 ? 'advanced' : wordCount > 300 ? 'intermediate' : 'beginner',
      book: bookTitle
    });
  }

  return chapters;
}

export async function fetchReadingMaterials(): Promise<{ books: Book[], chapters: Chapter[] }> {
  try {
    // Fetch both reading materials files
    const [materials1Response, materials2Response] = await Promise.all([
      fetch('/reading_materials.md'),
      fetch('/reading_materials2.md')
    ]);

    if (!materials1Response.ok || !materials2Response.ok) {
      throw new Error('Failed to fetch reading materials');
    }

    const materials1Content = await materials1Response.text();
    const materials2Content = await materials2Response.text();

    // Parse both files
    const chapters1 = parseMarkdownIntoChapters(materials1Content, 'book1', '읽기 훈련 교재');
    const chapters2 = parseNumberedTopics(materials2Content, 'book2', '일상 생활 에세이');

    const allChapters = [...chapters1, ...chapters2];

    // Create book summaries
    const books: Book[] = [
      {
        id: 'book1',
        title: '읽기 훈련 교재',
        description: '체계적인 읽기 능력 향상을 위한 전문 교재',
        totalChapters: chapters1.length,
        totalWordCount: chapters1.reduce((sum, ch) => sum + ch.wordCount, 0),
        estimatedTotalTime: chapters1.reduce((sum, ch) => sum + ch.estimatedReadingTime, 0)
      },
      {
        id: 'book2',
        title: '일상 생활 에세이',
        description: '일상의 소소한 이야기와 건강한 생활 습관에 대한 에세이',
        totalChapters: chapters2.length,
        totalWordCount: chapters2.reduce((sum, ch) => sum + ch.wordCount, 0),
        estimatedTotalTime: chapters2.reduce((sum, ch) => sum + ch.estimatedReadingTime, 0)
      }
    ];

    return { books, chapters: allChapters };
  } catch (error) {
    console.error('Error fetching reading materials:', error);
    return { books: [], chapters: [] };
  }
}

export function getChaptersByBook(chapters: Chapter[], bookId: string): Chapter[] {
  return chapters.filter(chapter => chapter.id.startsWith(bookId));
}

export function getChaptersByDifficulty(chapters: Chapter[], difficulty: string): Chapter[] {
  return chapters.filter(chapter => chapter.difficulty === difficulty);
}

// 챕터별로 그룹화된 샘플 텍스트 (파일 로드 실패시 대체용)
export const getSampleChapters = (): Chapter[] => {
  return [
    {
      id: 'chapter-1',
      title: 'Down the Rabbit-Hole',
      content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.`,
      wordCount: 150,
      estimatedReadingTime: 1,
      difficulty: 'beginner',
      book: '샘플 교재'
    },
    {
      id: 'chapter-2',
      title: 'The Pool of Tears',
      content: `"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); "now I'm opening out like the largest telescope that ever was! Good-bye, feet!" (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). "Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can;—but I must be kind to them," thought Alice, "or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas."

And she went on planning to herself how she would manage it. "They must go by the carrier," she thought; "and how funny it'll seem, sending presents to one's own feet! And how odd the directions will look!`,
      wordCount: 120,
      estimatedReadingTime: 1,
      difficulty: 'beginner',
      book: '샘플 교재'
    },
    {
      id: 'chapter-3',
      title: 'A Caucus-Race and a Long Tale',
      content: `They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.

The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life. Indeed, she had quite a long argument with the Lory, who at last turned sulky, and would only say, "I am older than you, and must know better;" and this Alice would not allow without knowing how old it was, and, as the Lory positively refused to tell its age, there was no more to be said.`,
      wordCount: 100,
      estimatedReadingTime: 1,
      difficulty: 'intermediate',
      book: '샘플 교재'
    }
  ];
};

// 챕터 검색
export const searchChapters = (chapters: Chapter[], query: string): Chapter[] => {
  const lowerQuery = query.toLowerCase();
  return chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(lowerQuery) ||
    chapter.content.toLowerCase().includes(lowerQuery)
  );
}; 