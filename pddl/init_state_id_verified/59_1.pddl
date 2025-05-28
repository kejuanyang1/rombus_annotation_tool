(define (problem generated)
  (:domain manip)
  (:objects
    container_05 - container
    tool_02 tool_03 tool_08 tool_09 - item
  )
  (:init
    (clear tool_02)
    (clear tool_03)
    (clear tool_08)
    (clear tool_09)
    (handempty)
    (in tool_03 container_05)
    (ontable container_05)
    (ontable tool_02)
    (ontable tool_08)
    (ontable tool_09)
  )
  (:goal (and))
)
