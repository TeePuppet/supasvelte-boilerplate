// lib/utils/keywordAnalysis.ts

export interface ShirtData {
    title: string;
    mainTag: string;
    secondaryTags: string[];
}

export interface Analysis {
    totalItems: number;
    titlePatterns: {
        averageLength: number;
        averageCharCount: number;
        commonWords: Record<string, number>;
        wordCount: Record<string, number>;
        charCount: Record<string, number>;
    };
    mainTagFrequency: Record<string, number>;
    secondaryTagPatterns: {
        averageCount: number;
        commonTags: Record<string, number>;
    };
    relatedTagsUsage: Record<string, number>;
    alsoSearchedUsage: Record<string, number>;
    recommendations: string[];
}

export function analyzeTopRankingPatterns(shirts: ShirtData[], relatedTags: string[], alsoSearched: string[]): Analysis {
    const analysis: Analysis = {
        totalItems: shirts.length,
        titlePatterns: {
            averageLength: 0,
            averageCharCount: 0,
            commonWords: {},
            wordCount: {},
            charCount: {}
        },
        mainTagFrequency: {},
        secondaryTagPatterns: {
            averageCount: 0,
            commonTags: {}
        },
        relatedTagsUsage: {},
        alsoSearchedUsage: {},
        recommendations: []
    };

    let totalTitleLength = 0;
    let totalTitleCharCount = 0;
    let totalSecondaryTagCount = 0;

    // Initialize usage counters
    relatedTags.forEach(tag => analysis.relatedTagsUsage[tag] = 0);
    alsoSearched.forEach(term => analysis.alsoSearchedUsage[term] = 0);

    shirts.forEach((shirt: ShirtData) => {
        // Analyze title
        const titleWords = shirt.title.toLowerCase().split(/\s+/);
        const titleCharCount = shirt.title.length;
        totalTitleLength += titleWords.length;
        totalTitleCharCount += titleCharCount;

        titleWords.forEach((word: string) => {
            analysis.titlePatterns.commonWords[word] = (analysis.titlePatterns.commonWords[word] || 0) + 1;
            
            // Check for related tags and also searched terms in title
            checkTermUsage(word, relatedTags, analysis.relatedTagsUsage);
            checkTermUsage(word, alsoSearched, analysis.alsoSearchedUsage);
        });
        analysis.titlePatterns.wordCount[titleWords.length] = (analysis.titlePatterns.wordCount[titleWords.length] || 0) + 1;
        analysis.titlePatterns.charCount[titleCharCount] = (analysis.titlePatterns.charCount[titleCharCount] || 0) + 1;

        // Analyze main tag
        analysis.mainTagFrequency[shirt.mainTag] = (analysis.mainTagFrequency[shirt.mainTag] || 0) + 1;
        checkTermUsage(shirt.mainTag, relatedTags, analysis.relatedTagsUsage);
        checkTermUsage(shirt.mainTag, alsoSearched, analysis.alsoSearchedUsage);

        // Analyze secondary tags
        totalSecondaryTagCount += shirt.secondaryTags.length;
        shirt.secondaryTags.forEach((tag: string) => {
            analysis.secondaryTagPatterns.commonTags[tag] = (analysis.secondaryTagPatterns.commonTags[tag] || 0) + 1;
            checkTermUsage(tag, relatedTags, analysis.relatedTagsUsage);
            checkTermUsage(tag, alsoSearched, analysis.alsoSearchedUsage);
        });
    });

    // Calculate averages
    analysis.titlePatterns.averageLength = totalTitleLength / shirts.length;
    analysis.titlePatterns.averageCharCount = totalTitleCharCount / shirts.length;
    analysis.secondaryTagPatterns.averageCount = totalSecondaryTagCount / shirts.length;

    // Sort and limit common words, tags, etc.
    analysis.titlePatterns.commonWords = sortAndLimitObject(analysis.titlePatterns.commonWords, 10);
    analysis.mainTagFrequency = sortAndLimitObject(analysis.mainTagFrequency, 5);
    analysis.secondaryTagPatterns.commonTags = sortAndLimitObject(analysis.secondaryTagPatterns.commonTags, 10);

    // Generate insights and recommendations
    generateInsightsAndRecommendations(analysis, relatedTags, alsoSearched);

    return analysis;
}

function checkTermUsage(word: string, terms: string[], usageObject: Record<string, number>) {
    terms.forEach(term => {
        if (word.toLowerCase().includes(term.toLowerCase())) {
            usageObject[term]++;
        }
    });
}

function sortAndLimitObject(obj: Record<string, number>, limit: number): Record<string, number> {
    return Object.fromEntries(
        Object.entries(obj)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
    );
}

function generateInsightsAndRecommendations(analysis: Analysis, relatedTags: string[], alsoSearched: string[]): void {
    // Title insights
    analysis.recommendations.push(
        `Average title length is ${analysis.titlePatterns.averageLength.toFixed(1)} words and ${analysis.titlePatterns.averageCharCount.toFixed(1)} characters. Consider using titles of similar length.`
    );
    analysis.recommendations.push(
        `Most common title words: ${Object.keys(analysis.titlePatterns.commonWords).join(', ')}. Consider incorporating these words in your titles.`
    );

    // Main tag insights
    const topMainTag = Object.keys(analysis.mainTagFrequency)[0];
    analysis.recommendations.push(
        `The most common main tag is "${topMainTag}". Consider using this as your main tag if relevant to your design.`
    );

    // Secondary tag insights
    analysis.recommendations.push(
        `Average number of secondary tags used: ${analysis.secondaryTagPatterns.averageCount.toFixed(1)}. Aim for a similar number of tags.`
    );
    analysis.recommendations.push(
        `Top secondary tags: ${Object.keys(analysis.secondaryTagPatterns.commonTags).join(', ')}. Consider using these tags if relevant to your design.`
    );

    // Word count recommendation
    const optimalWordCount = Object.entries(analysis.titlePatterns.wordCount).sort(
        ([, a], [, b]) => b - a
    )[0][0];
    analysis.recommendations.push(
        `The most common title word count is ${optimalWordCount}. Consider aiming for titles with around ${optimalWordCount} words.`
    );

    // Character count recommendation
    const optimalCharCount = Object.entries(analysis.titlePatterns.charCount).sort(
        ([, a], [, b]) => b - a
    )[0][0];
    analysis.recommendations.push(
        `The most common title character count is ${optimalCharCount}. Aim for titles with approximately ${optimalCharCount} characters for optimal visibility.`
    );

    // Related tags insights
    const unusedRelatedTags = relatedTags.filter(tag => analysis.relatedTagsUsage[tag] === 0);
    if (unusedRelatedTags.length > 0) {
        analysis.recommendations.push(`Consider using these related tags that aren't currently used: ${unusedRelatedTags.join(', ')}.`);
    }

    const topUsedRelatedTags = Object.entries(analysis.relatedTagsUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([tag, count]) => `${tag} (${count} times)`);
    if (topUsedRelatedTags.length > 0) {
        analysis.recommendations.push(`Top used related tags: ${topUsedRelatedTags.join(', ')}. These are effective, consider using them more.`);
    }

    // Also searched insights
    const unusedAlsoSearched = alsoSearched.filter(term => analysis.alsoSearchedUsage[term] === 0);
    if (unusedAlsoSearched.length > 0) {
        analysis.recommendations.push(`Consider incorporating these frequently searched terms: ${unusedAlsoSearched.join(', ')}.`);
    }

    const topUsedAlsoSearched = Object.entries(analysis.alsoSearchedUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([term, count]) => `${term} (${count} times)`);
    if (topUsedAlsoSearched.length > 0) {
        analysis.recommendations.push(`Top used 'also searched' terms: ${topUsedAlsoSearched.join(', ')}. These are popular, consider using them more.`);
    }
}