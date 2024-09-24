export default function Page() {
  return (
    <>
      <h1>About QB Logs</h1>
      <div className="flex flex-col gap-2 mb-4">
        <p>QB Logs stems from my experience as a college quarterback. While Hudl excels at film review, I saw an opportunity to enhance how offensive data from games and practices is analyzed. By integrating film review with data insights, the goal is to create a tool that shortens feedback loops and improves team alignment.</p>
        <p>QB Logs delivers a complete view of QB performance in games and practices, empowering small college and high school coaches to make data-driven decisions that accelerate QB development and optimize offensive strategy.</p>
        <p><span className="font-bold">Motto: </span>&quot;Practice analytically, perform intuitively.&quot;</p>
        <p className="text-sm italic">Currently, QB Logs is under active development and being used exclusively by Briar Cliff Football.</p>
      </div>
      <h2><a href="https://leather-shad-55b.notion.site/QB-Logs-Changelog-708da2ceb9a44d21bf575a2ecbb1031a" className="link">Changelog</a></h2>
      <div className="flex flex-col gap-2 mt-4">
        <h2>Stack</h2>
        <ul className="list-disc list-inside">
          <li>Next.js (Tailwind)</li>
          <li>Supabase</li>
        </ul>
      </div>
    </>
  );
}
