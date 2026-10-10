import {
  CheckCircle2,
} from 'lucide-react'

import {
  PanelSection,
} from '../common'

export function WorkflowInfo() {
  return (
    <PanelSection title="Workflow">
      <div className="workflowList">
        <div className="workflowItem">
          <CheckCircle2 size={15} />
          <span>
            Upload image
          </span>
        </div>

        <div className="workflowItem">
          <CheckCircle2 size={15} />
          <span>
            Adjust pencil edges
          </span>
        </div>

        <div className="workflowItem">
          <CheckCircle2 size={15} />
          <span>
            Choose grid size
          </span>
        </div>

        <div className="workflowItem">
          <CheckCircle2 size={15} />
          <span>
            Paint cell by cell
          </span>
        </div>

        <div className="workflowItem">
          <CheckCircle2 size={15} />
          <span>
            Export your guide
          </span>
        </div>
      </div>
    </PanelSection>
  )
}