(define (problem scene1)
  (:domain manip)
  (:objects
    tool_02 - item
    tool_03 - item
    tool_08 - item
    tool_09 - item
    container_05 - container
  )
  (:init
    (ontable tool_02)
    (ontable tool_08)
    (ontable tool_09)
    (in tool_03 container_05)
    (ontable container_05)
    (handempty)
    (clear tool_02)
    (clear tool_08)
    (clear tool_09)
  )
  (:goal (and ))
)