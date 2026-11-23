G.chapter({
  id: "ch9", num: 9, title: "Team Dynamics and Performance", bok: "II.F", pages: "144–166",
  lede: "Teams fail more often on dynamics than on statistics. Expect named-character scenarios: diagnose the stage or the negative dynamic, pick the countermeasure, fix the RACI, choose the decision tool.",
  sections: [
    {
      id: "formation", title: "Team basics, formation and virtual teams", bok: "II.F.1", level: "Understand", pages: "144–145",
      html: `
        <ul>
          <li><b>Meeting protocol:</b> an agenda (flexible, but have one), minutes with actions, keeping to time, enforced attendance, and a kickoff with introductions, goals, objectives and milestones. Some teams display goals and scope at every meeting. Management presence at kickoff and at intervals signals importance.</li>
          <li><b>Size:</b> usually <b>5–9 members, 7 ideal</b>, with complementary skills — scaled to the project (one or two people for a small one; sub-teams for a big one). Under five means fewer interaction problems; over nine creates counterproductive interaction.</li>
          <li><b>Membership:</b> stakeholders are <b>always</b> on the team (or represented) — otherwise the team can't implement. Subject-matter experts may sit outside as extended members. A deliberate outsider asks questions insiders never think of, but needs moderating. Teams are typically cross-functional, and more diverse teams interact better.</li>
          <li><b>Virtual teams:</b> lower cost and real-time data sharing, but slower team-building, harder commitment and buy-in, and more miscommunication — especially voice-only, where non-verbal cues are lost. They work best when members already know each other.</li>
        </ul>
        ${G.trap(`<p>Subject-matter experts <i>may</i> stay outside the core team; stakeholders may <b>not</b>. A distractor that keeps stakeholders out “to avoid bias” contradicts the handbook.</p>`)}`
    },
    {
      id: "stages", title: "Team stages and leadership style", bok: "II.F.1", level: "Understand", hy: true, pages: "145–148",
      html: `
        <p>Tuckman's sequence — forming, storming, norming, performing — plus adjourning and recognition. Stages can lengthen or shorten with culture, team maturity, task complexity and leadership, but teams still pass through them, and going through them sets ground rules and expectations.</p>
        ${G.w("tuckman")}
        ${G.w("stageid")}
        ${G.trap(`<p><b>Forming</b> teams also agree a lot — because members are trying to please each other, not because conflict has been resolved. Agreement plus little output = forming. Agreement after conflict, with trust and some output = norming.</p>`)}
        ${G.tab(`<p>pp. 147–148: write the four pairs in the margin: forming–directing, storming–coaching, norming–supporting, performing–delegating.</p>`)}`
    },
    {
      id: "negative", title: "Negative team dynamics", bok: "II.F.1", level: "Understand", hy: true, pages: "148–152",
      html: `
        <p>Many negative dynamics reflect organizational culture more than personalities — if something is acceptable as a norm, the culture enables it. Left unaddressed they hurt motivation, self-esteem and morale, and can cause missed goals and milestones, targets revised in the team's favour, poor use of resources, cost overruns or cancellation.</p>
        ${G.w("dynamics")}
        <h3>Close differences</h3>
        ${G.table(["Pair", "How to tell them apart"], [
          ["Overbearing vs dominant", "Overbearing = authority or expertise silences others (senior manager, founder, investor, SME). Dominant = airtime — interrupting and talking over people."],
          ["Groupthink vs unquestioned acceptance of opinions as facts", "Groupthink = no public disagreement to protect harmony; doubts expressed privately. Unquestioned acceptance = claims accepted without data or analysis."],
          ["Attribution vs rush to accomplishment", "Attribution = casual, emotional explanations instead of seeking causes. Rush = cutting data collection and analysis to hit a deadline."],
          ["Floundering vs digressions and tangents", "Floundering = unsteady progress from lack of direction or overwhelm; decisions postponed. Digressions = discussion straying off the agenda."],
          ["Discounts vs reluctant participants", "Discounts = a member's input is ignored or mocked by others. Reluctant = the member holds back (no stake, intimidation, fear)."]
        ])}
        ${G.trap(`<p>For <b>feuding</b>, confront the adversaries <b>offline</b>, not in the meeting — public confrontation can make it worse. The other countermeasures: enforce discipline and mutual respect, restate the team's objective.</p>`)}
        ${G.tab(`<p>pp. 149–152: tab Table 9.1 as a whole. It is the single best open-book lookup for dynamics scenarios.</p>`)}`
    },
    {
      id: "roles", title: "Roles, responsibilities and RACI", bok: "II.F.2", level: "Apply", hy: true, pages: "152–159",
      html: `
        <p>Six Sigma succeeds partly because of the structure it demands: without it there is no accountability for the investment in training and resources. Smaller organizations combine roles but keep the responsibilities.</p>
        ${G.w("roles")}
        <p class="small"><b>Also named in the BoK:</b> the <b>sponsor</b> backs the project and owns its business case (the executive or champion often fills this), the <b>coach</b> guides practitioners in the method (typically a Master Black Belt or Black Belt), and the <b>facilitator</b> runs the team's process — explaining rules, keeping discussion on track and drawing out participation — without supplying the content.</p>
        ${G.flag(`<p>Table 9.3 calls the Green Belt role “typically a full-time position”, though some organizations make it part of an existing job. Many references describe Green Belts as part-time project leads who keep their regular job. The safe exam distinction: Master Black Belt and Black Belt are <b>always full-time</b>; a Green Belt leads smaller projects and supports Black Belt projects.</p>`)}
        <h3>RACI</h3>
        <p>List the team members down one axis and the tasks (starting from the statement of work, toll gates optional) along the other. RASIC adds <b>S</b> for those who support.</p>
        ${G.w("raci")}
        ${G.trap(`<p><b>Champion</b> removes barriers across projects and approves completed projects; the <b>process owner</b> owns one process, selects team members and makes sure the gains are <b>sustained</b>; the <b>executive</b> sets the program's direction. “Who ensures improvements are sustained?” — process owner.</p>`)}`
    },
    {
      id: "tools", title: "Brainstorming, nominal group technique and multivoting", bok: "II.F.3", level: "Apply", hy: true, pages: "159–166",
      html: `
        <h3>Brainstorming</h3>
        <ol class="steps-v">
          <li><p><b>Creative phase.</b> As many ideas as possible: no criticism, compliments or questions; wild ideas welcome; don't wait; quantity over quality; hitchhike on others' ideas.</p></li>
          <li><p><b>Break of at least 10 minutes.</b> Different parts of the brain do creating and judging.</p></li>
          <li><p><b>Evaluation phase.</b> A facilitator walks the list in sequence — an affinity diagram is a good start. Don't be overly critical; “crazy” ideas can work.</p></li>
        </ol>
        <p><b>Structured (round-robin):</b> one idea per turn, members may pass, building on others' ideas is fine, and the recorder may ask for clarity but never rephrases without the owner's consent. <b>Freewheeling</b> also works. Coach the team beforehand to avoid idea-stoppers such as “it won't work here”, “we've never done it before” or “management won't like it”.</p>
        <h3>Nominal group technique</h3>
        <p>Brainstorming with limited talking — hence “nominal”. Use it when some members are much more vocal than others, or the topic is controversial or sensitive: it reduces peer pressure. Members get 10–15 minutes to generate ideas silently; ideas are collected and posted (or read round-robin) without judgment; the leader may collect them to keep contributors anonymous.</p>
        <h3>Multivoting</h3>
        <p>Number the consolidated ideas; each member prioritises their top five or ten in five to ten minutes. The facilitator restates the objective so votes don't scatter. Then rank (ranked approach) or rate by splitting 100 points (weighted approach).</p>
        ${G.w("multivote")}
        ${G.trap(`<p>NGT is the answer when a stem mentions dominant members, sensitive topics, or the need for anonymity. Plain brainstorming is the answer when the stem wants the widest range of creative ideas fast.</p>`)}`
    },
    {
      id: "decide", title: "Decision-making concepts", bok: "II.F.3", level: "Apply", pages: "163–164",
      html: `
        <ul>
          <li><b>Top-down:</b> the leader decides.</li>
          <li><b>Consensus:</b> the decision is acceptable enough that <b>all members will support it</b>. Everyone must be allowed to express their views and must objectively listen to others; discuss until consensus is reached.</li>
          <li><b>Fact-based decision-making:</b> data leads the decision — a phrase ISO management-system auditors use.</li>
        </ul>
        ${G.w("decisions")}
        ${G.trap(`<p>Consensus is <b>not</b> majority vote and <b>not</b> unanimity. It means everyone can support the decision, even if it wasn't their first choice.</p>`)}`
    },
    {
      id: "tcomm", title: "Team communication", bok: "II.F.4", level: "Apply", pages: "166",
      html: `
        <p>Beyond the basics in Chapter 8, a team must talk to the other project groups working around it: what are you doing that might affect them, and vice versa? Treat them as partners in continual improvement.</p>
        <p>Use a project report — the company's formal system, an <b>A3 report</b> or a scoreboard — so non-team members can see progress and next steps. Phase reviews and toll gates (Chapter 6) are the formal channel to sponsors and management.</p>`
    }
  ],
  check: [
    { q: "Two weeks after kickoff, Ana notices her team agrees with every idea raised, members are eager to please, and little work has been produced. The team is most likely in which stage?",
      o: ["Norming", "Storming", "Forming", "Performing"], a: 2,
      why: "Pleasing each other, agreeing too readily and accomplishing little are forming characteristics.",
      d: { 0: "Norming agreement follows resolved conflict, with trust and some output.", 1: "Storming shows conflict, not easy agreement.", 3: "Performing produces a large amount of work." }, ref: "146" },
    { q: "According to the handbook, which leadership style fits a team in the storming stage?",
      o: ["Coaching", "Directing", "Supporting", "Delegating"], a: 0,
      why: "Storming: still directive, adding supportive behaviour and more listening — coaching.",
      d: { 1: "Directing fits forming.", 2: "Supporting fits norming.", 3: "Delegating fits performing." }, ref: "148" },
    { q: "In Luis's team nobody disagrees in meetings, but several members voice doubts privately afterward because they don't want to disturb the group's harmony. This is best described as:",
      o: ["Reluctant participants", "Discounts", "Unquestioned acceptance of opinions as facts", "Groupthink"], a: 3,
      why: "No public disagreement, doubts expressed privately, harmony put first — groupthink.",
      d: { 0: "Reluctance is individual disengagement, not a group-wide suppression of dissent.", 1: "Discounts means members' opinions are ignored or mocked.", 2: "That is about accepting claims without data — a different failure." }, ref: "151" },
    { q: "Two team leads trade heated arguments every meeting. What does the handbook recommend?",
      o: ["Confront them in the meeting so the whole team sees the standard", "Confront the adversaries offline, outside the team meeting", "Hold a team vote on which lead is right", "Remove both leads from the team"], a: 1,
      why: "Confronting in public can worsen the situation; deal with it offline, then enforce ground rules and restate the objective.",
      d: { 0: "The handbook warns that public confrontation can make it worse.", 2: "Voting on people doesn't address the conflict.", 3: "Not among the handbook's countermeasures." }, ref: "151" },
    { q: "A RACI chart shows both the champion and the process owner as “A” for approving the charter. Which rule does this break?",
      o: ["Each task must have exactly one Accountable role", "Champions cannot appear on a RACI chart", "Every role must be Responsible for at least one task", "Consulted and Informed cannot appear on the same row"], a: 0,
      why: "Accountability must sit with one role per task; two A's blur ownership.",
      d: { 1: "Champions often appear on RACI charts.", 2: "Not a RACI rule.", 3: "Not a rule — rows commonly mix C and I." }, ref: "153" },
    { q: "A team must generate ideas on a sensitive topic, and two senior members tend to dominate discussion. Which technique best fits?",
      o: ["Freewheeling brainstorming", "Multivoting", "Nominal group technique", "Affinity diagram"], a: 2,
      why: "NGT limits verbal interaction, reduces peer pressure and can keep contributors anonymous.",
      d: { 0: "Freewheeling lets dominant members dominate further.", 1: "Multivoting prioritises existing ideas; it doesn't generate them.", 3: "Affinity organises ideas after they exist." }, ref: "164" },
    { q: "In the weighted multivoting approach, each team member:",
      o: ["Ranks the options from 1 to 5", "Splits 100 points among the options", "Gets one vote for a single option", "Must agree before the vote counts"], a: 1,
      why: "Weighted multivoting rates rather than ranks — like dividing $100 or 100 points.",
      d: { 0: "That is the ranked approach.", 2: "Single-vote plurality is not multivoting.", 3: "That describes consensus, not voting." }, ref: "165" },
    { q: "Which best describes a consensus decision?",
      o: ["More than half the team votes for it", "Every member's first choice is the same option", "The leader decides after hearing the team", "Every member can support it, even if it wasn't their first choice"], a: 3,
      why: "The handbook: acceptable enough that all members will support it.",
      d: { 0: "Majority vote.", 1: "Unanimity — stronger than consensus.", 2: "Top-down with consultation." }, ref: "164" },
    { q: "According to the handbook, a team usually consists of how many members?",
      o: ["3–5, with 4 ideal", "5–9, with 7 ideal", "8–12, with 10 ideal", "10–15, with 12 ideal"], a: 1,
      why: "Five to nine members, seven ideal, scaled to project size and scope.",
      d: { 0: "Below the usual range; teams under five are easier to manage but have fewer interactions.", 2: "Over nine produces counterproductive interaction.", 3: "Far too large; use sub-teams." }, ref: "144" }
  ]
});
