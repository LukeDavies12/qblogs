# QB Logs
![QB Logs demo image](images/QBL1.png)
![QB Logs demo image](images/QBL-family-breakdown.png)
![QB Logs demo image](images/QBL-log.png)

QB Logs is a tool for QBs and offensive coaches.
1. Comprehensive breakdown of QB decision-making and execution by play type
2. Integration of game and practice data for holistic performance assessment
3. Visual representation of offensive production for week-to-week goal-setting and progress tracking
4. Custom analytics tailored for small college and high school football programs

The platform's core thesis is that presenting offensive data from both games and practices in an accessible format, enhanced with domain-specific insights, will be used hand-in-hand with film study on a daily basis in small college and high school football. "Practice analytically, perform intuitively."

Currently only used by Briar Cliff football and I am working on developing out the required features to sell as a SAAS.

## Data Model
![QB Logs Data Model Image](/images/dataModel.png)

## Stack
- Next.js (Tailwind)
- Supabase

### App Features
- Authorization and Supabse RLS by use case
- Reactive UI (pending, loading states on forms)
- Type safety
- Admin functions to scaffold team setup and user accounts
