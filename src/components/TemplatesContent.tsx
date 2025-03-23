export default function TemplatesContent() {
  return (
    <div>
      <h2 className="text-sm font-medium text-[#9FADBC] mb-4">All templates</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="w-[180px] h-[96px] bg-[#282E33] hover:bg-[#A6C5E229] rounded-lg flex items-center justify-center">
          <span className="text-[#9FADBC] hover:text-[#B6C2CF] text-sm">Create new template</span>
        </div>
      </div>
    </div>
  );
}
