import { JSX } from "react";

type ImageInfo = {
  title: string;
  description: JSX.Element | null;
  imagePath: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
};

export const imagesInfo: Record<string, ImageInfo> = {
  "reversal_patterns.png": {
    title: "Reversal Patterns",
    level: "Beginner",
    summary:
      "Reversal patterns are critical for traders as they signal potential end of a trend and insights into market sentiments.",
    description: (
      <div>
        <strong>Reversal patterns</strong> are critical for traders as they
        signal:
        <ul>
          <li>
            <strong>Potential End of a Trend</strong>: The start of a new trend
            in the opposite direction.
          </li>
          <li>
            <strong>Examples</strong>: Head and shoulders, inverse head and
            shoulders, double tops, and double bottoms.
          </li>
          <li>
            <strong>Insights</strong>: Provide significant insights into market
            sentiments and potential shifts.
          </li>
          <li>
            <strong>Predictive Value</strong>: Help in predicting price
            movements and making informed trading decisions.
          </li>
        </ul>
      </div>
    ),
    imagePath: "/images/reversal_patterns.png"
  },
  "continuation_patterns.png": {
    level: "Intermediate",
    summary:
      "Continuation patterns suggest that the prevailing trend is likely to continue once the pattern has completed.",
    title: "Continuation Patterns",
    description: (
      <div>
        <strong>Continuation patterns</strong> suggest that:
        <ul>
          <li>
            <strong>Trend Continuation</strong>: The prevailing trend is likely
            to continue once the pattern has completed.
          </li>
          <li>
            <strong>Examples</strong>: Triangles, flags, and pennants.
          </li>
          <li>
            <strong>Nature</strong>: These patterns are shorter-term by nature
            and frequent within trending markets.
          </li>
          <li>
            <strong>Opportunities</strong>: Offer opportunities for traders to
            re-enter or strengthen their current positions.
          </li>
        </ul>
      </div>
    ),
    imagePath: "/images/continuation_patterns.png"
  },
  "bilateral_patterns.png": {
    level: "Advanced",
    summary:
      "Bilateral patterns indicate that the stock price could move either upwards or downwards.",
    title: "Bilateral Patterns",
    description: (
      <div>
        <strong>Bilateral patterns</strong> are unique because they:
        <ul>
          <li>
            <strong>Direction Uncertainty</strong>: Indicate that the stock
            price could move either upwards or downwards.
          </li>
          <li>
            <strong>Examples</strong>: Symmetrical triangles.
          </li>
          <li>
            <strong>Risk Management</strong>: Require careful analysis and risk
            management.
          </li>
          <li>
            <strong>Market Influence</strong>: Could lead to significant price
            moves depending on external market factors and trader sentiment.
          </li>
        </ul>
      </div>
    ),
    imagePath: "/images/bilateral_patterns.png"
  }
};
