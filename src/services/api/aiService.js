import { fetchWithRetry } from '@/utils/fetchWithRetry';

class AIService {
  constructor() {
    this.baseUrl = '/api/ai';
  }

  async generateContent(prompt, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simulate AI content generation
      const { keywords, contentType, contentGoal, location, companyName } = options;
      
      const content = this.generateMockContent(keywords, contentType, contentGoal, location, companyName);
      
      return {
        content,
        metadata: {
          wordCount: content.split(' ').length,
          seoScore: Math.floor(Math.random() * 30) + 70,
          readabilityScore: Math.floor(Math.random() * 20) + 80,
          keywordDensity: Math.floor(Math.random() * 3) + 2
        }
      };
    } catch (error) {
      throw new Error('Failed to generate content');
    }
  }

  async refineContent(content, instructions) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Simulate content refinement
      const refinedContent = content + "\n\n*Content has been refined for better SEO and readability.*";
      
      return {
        content: refinedContent,
        changes: [
          'Improved keyword distribution',
          'Enhanced readability score',
          'Optimized meta descriptions',
          'Added relevant internal links'
        ]
      };
    } catch (error) {
      throw new Error('Failed to refine content');
    }
  }

  async getSupplementaryInsights(keywords) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const insights = [
        `Current trends in ${keywords} show increased search volume`,
        `Related keywords: ${keywords} services, ${keywords} solutions, ${keywords} tips`,
        `Top competitors are focusing on local SEO strategies`,
        `User intent analysis suggests informational and commercial queries`
      ];
      
      return {
        insights,
        relatedKeywords: [
          `${keywords} services`,
          `${keywords} solutions`,
          `${keywords} tips`,
          `${keywords} guide`
        ],
        trendingTopics: [
          'Local SEO optimization',
          'Voice search optimization',
          'Mobile-first indexing',
          'User experience signals'
        ]
      };
    } catch (error) {
      throw new Error('Failed to get supplementary insights');
    }
  }

  generateMockContent(keywords, contentType, contentGoal, location, companyName) {
    const locationText = location ? ` in ${location}` : '';
    const companyText = companyName ? ` at ${companyName}` : '';
    
    return `# ${contentType}: ${keywords}${locationText}

## Introduction

Welcome to our comprehensive guide on ${keywords}${locationText}. Whether you're a homeowner or business owner, understanding ${keywords} is crucial for making informed decisions${companyText}.

## What You Need to Know About ${keywords}

${keywords} services have evolved significantly over the years. Here's what you should consider:

### Key Benefits
- Professional expertise and experience
- Time-saving solutions
- Quality assurance and reliability
- Cost-effective long-term value

### Common Challenges
- Finding the right service provider
- Understanding pricing structures
- Ensuring quality standards
- Timing and scheduling considerations

## Our Approach to ${keywords}

${companyText ? `At ${companyName}, we` : 'We'} believe in delivering exceptional ${keywords} services that exceed expectations. Our team of experienced professionals brings years of expertise to every project.

### Why Choose Professional ${keywords} Services?

1. **Expertise and Experience**: Our skilled professionals have handled countless ${keywords} projects
2. **Quality Materials**: We use only the best materials and equipment
3. **Timely Completion**: Projects are completed on schedule
4. **Customer Satisfaction**: Your satisfaction is our top priority

## ${keywords} Best Practices

To ensure the best results from your ${keywords} project:

- **Planning**: Proper planning prevents poor performance
- **Communication**: Clear communication throughout the process
- **Quality Control**: Regular quality checks ensure standards
- **Follow-up**: Post-project support and maintenance

## Local ${keywords} Considerations${locationText}

${location ? `In ${location}, specific factors affect ${keywords} projects:

- Local regulations and permits
- Weather and seasonal considerations
- Regional material availability
- Local contractor expertise

## Finding the Right ${keywords} Professional${locationText}

When searching for ${keywords} services${locationText}, consider:

- Licensed and insured professionals
- Positive customer reviews and testimonials
- Transparent pricing and estimates
- Local knowledge and experience` : ''}

## Conclusion

${keywords} is an important investment that requires careful consideration. By choosing the right professional service${companyText}, you can ensure quality results that last.

Contact us today to discuss your ${keywords} needs and discover how we can help you achieve your goals.

---

*For more information about ${keywords} services${locationText}, contact our team of experts today.*`;
  }
}

export default new AIService();