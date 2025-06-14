// AI Service for generating insights and suggestions
// Future-proof for OpenAI, Claude, or Gemini integration

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  tag: string;
  category: 'fantasy' | 'betting' | 'analysis' | 'prediction';
  explanation: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  timestamp: string;
}

// Simulated AI responses for demonstration
const mockInsights = [
  {
    question: "Who are the top WRs this week?",
    answer: `Based on current matchup analysis and recent performance data, here are the top wide receivers for this week:

**Tier 1 (Must-Start):**
• **Tyreek Hill** vs DEN - Elite target share with favorable coverage matchup
• **Stefon Diggs** vs NYJ - Consistent volume in high-scoring projected game
• **Davante Adams** vs CHI - Prime bounce-back spot after slow start

**Tier 2 (Strong Start):**
• **A.J. Brown** vs WSH - Red zone upside in potential shootout
• **DeAndre Hopkins** vs IND - Veteran presence with reliable floor

**Key Matchup Notes:**
- Denver's secondary has allowed 18+ fantasy points to WRs in 3 of last 4 games
- Chicago's slot coverage ranks bottom-5 in efficiency metrics
- Weather conditions favor passing attacks in all mentioned games

*Confidence: 87% based on target projections and defensive rankings*`,
    confidence: 87,
    sources: ["ESPN Analytics", "PFF Grades", "Weather.com"],
  },
  {
    question: "NBA injury trends this season",
    answer: `Current NBA injury landscape shows several concerning patterns:

**High-Risk Categories:**
🔴 **Load Management** - Up 23% from last season
• Stars resting on back-to-backs more frequently
• Average games missed: 8-12 per superstar

🟡 **Soft Tissue Injuries** - Hamstring/calf strains up 15%
• Likely related to condensed schedule recovery
• Average recovery time: 2-3 weeks

**Teams Most Affected:**
1. **LA Clippers** - 45 total games missed by starters
2. **Phoenix Suns** - 38 games missed, mostly Durant/Booker
3. **Milwaukee Bucks** - 34 games, Giannis load management

**Fantasy Impact:**
- Backup players seeing 18% more minutes on average
- DFS value plays more abundant in 2024 season
- Injury replacements averaging 1.3x their projected usage

*Data current as of last update. Injury reports change rapidly.*`,
    confidence: 92,
    sources: ["NBA Injury Report", "Rotowire", "Basketball Reference"],
  },
  {
    question: "Best NFL props for Sunday",
    answer: `Here are the highest-value NFL prop bets for Sunday's slate:

**Receiving Props (High Confidence):**
• **Travis Kelce Over 67.5 Rec Yards** (-110)
  - Averaging 78.4 yards vs similar defenses
  - Target share up to 26% in last 3 games

• **Mike Evans Under 5.5 Receptions** (-115)
  - Facing top slot corner, typically runs longer routes
  - Team trending toward run-heavy game script

**Rushing Props:**
• **Josh Jacobs Over 82.5 Rush Yards** (-110)
  - Opposition allows 4.8 YPC to RBs
  - Vegas expected to control game flow

**Touchdown Props:**
• **Ja'Marr Chase Anytime TD** (+120)
  - Red zone target share at season-high 31%
  - Favorable coverage matchup in RZ

**Bankroll Management:**
- Limit exposure to 2-3% of total bankroll per prop
- Consider correlation between same-game props

*Always gamble responsibly. These are analysis-based suggestions, not guarantees.*`,
    confidence: 78,
    sources: ["Vegas Insider", "Action Network", "Pro Football Focus"],
  }
];

const mockSuggestions = [
  {
    id: 'sug-1',
    title: 'Start Justin Jefferson vs NYG',
    description: 'Elite matchup against vulnerable secondary',
    confidence: 94,
    tag: 'FANTASY',
    category: 'fantasy' as const,
    explanation: `**Why This Makes Sense:**

Jefferson faces a Giants secondary that has surrendered the **3rd-most fantasy points** to wide receivers this season. The matchup breakdown:

• **Target Projection:** 10-12 targets (season average: 9.2)
• **Coverage Matchup:** Primarily against slot coverage, where Jefferson dominates
• **Game Script:** Vikings likely trailing, leading to pass-heavy approach
• **Weather:** Dome game, no weather concerns

**Statistical Edge:**
- Giants allow 8.2 catches per game to WR1s
- Jefferson's 28% target share jumps to 32% in negative game scripts
- Historical performance: 127 yards, 2 TDs in last Giants matchup

**Risk Factors:**
- Potential for early blowout reducing garbage time
- Jefferson dealing with minor ankle issue (probable)

**Verdict:** Strong WR1 play with ceiling for 20+ fantasy points.`,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sug-2',
    title: 'Bench Patrick Mahomes in Week 4',
    description: 'Tough road matchup against elite pass defense',
    confidence: 76,
    tag: 'FANTASY',
    category: 'fantasy' as const,
    explanation: `**Matchup Concerns:**

The Chargers defense presents multiple challenges for Mahomes:

• **Pass Rush:** 2nd in pressure rate (31.2%)
• **Secondary:** Allowing just 6.1 YPA to QBs
• **Red Zone Defense:** 1st in RZ TD%, limiting high-value scoring

**Alternative Options:**
- **Geno Smith** vs ARI (favorable home matchup)
- **Derek Carr** vs CLE (potential shootout)
- **Jared Goff** vs GB (dome environment)

**Why Mahomes Struggles Here:**
- Career 18.2 PPG average vs LAC (below season average)
- Road divisional games historically challenging
- Chiefs trending toward conservative game management

**Counterargument:**
- Elite talent can overcome any matchup
- Potential for garbage time production
- Travis Kelce healthy and productive

**Recommendation:** If you have a solid QB alternative, consider the pivot.`,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sug-3',
    title: 'Lakers Under 112.5 Points Tonight',
    description: 'Pace concerns and defensive matchup favor Under',
    confidence: 82,
    tag: 'BETTING',
    category: 'betting' as const,
    explanation: `**Betting Analysis:**

Tonight's Lakers total looks inflated based on recent trends:

**Key Factors Supporting Under:**
• **Pace Down:** Lakers averaging 97.8 possessions (down from 101.2 early season)
• **Opponent Defense:** Facing 7th-ranked defensive efficiency
• **B2B Fatigue:** Second night of back-to-back, legs typically heavy
• **Injury Report:** AD questionable, impacts offensive flow

**Historical Trends:**
- Lakers 4-1 to Under in last 5 road games
- Team averages 108.3 PPG on second night of B2Bs
- Opponent holds teams to 106.8 PPG at home

**Line Movement:**
- Opened at 114.5, down to 112.5 (sharp money on Under)
- 67% of handle on Over, but line moving opposite direction

**Risk Assessment:**
- Blowout could lead to garbage time scoring
- LeBron capable of explosive offensive games
- Potential for overtime extending total

**Lean:** Under 112.5 at current number provides value.`,
    timestamp: new Date().toISOString(),
  }
];

// Simulated AI service functions
export const generateAIInsight = async (question: string): Promise<AIInsight> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Find matching mock insight or use fallback
  const mockInsight = mockInsights.find(insight => 
    insight.question.toLowerCase().includes(question.toLowerCase().split(' ')[0]) ||
    question.toLowerCase().includes(insight.question.toLowerCase().split(' ')[0])
  ) || mockInsights[Math.floor(Math.random() * mockInsights.length)];
  
  return {
    id: `insight-${Date.now()}`,
    question,
    answer: mockInsight.answer,
    confidence: mockInsight.confidence,
    sources: mockInsight.sources,
    timestamp: new Date().toISOString(),
  };
};

export const generateAISuggestions = async (userContext?: string): Promise<AISuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Shuffle and return 3 random suggestions
  const shuffled = [...mockSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(suggestion => ({
    ...suggestion,
    id: `${suggestion.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }));
};

// Future integration points for real AI services
export const configureAIProvider = (provider: 'openai' | 'claude' | 'gemini', apiKey: string) => {
  // TODO: Initialize AI provider with API key
  console.log(`Configuring ${provider} with API key: ${apiKey.substring(0, 8)}...`);
};

export const setUserContext = (context: {
  favoriteTeams?: string[];
  preferredSports?: string[];
  fantasyLeagues?: string[];
  bettingPreferences?: string[];
}) => {
  // TODO: Store user context for personalized AI responses
  localStorage.setItem('tacctile_ai_context', JSON.stringify(context));
};