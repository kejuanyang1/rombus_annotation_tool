(define (problem scene)
  (:domain manip)
  (:objects
    tool_04 - item
    tool_06 - item
    tool_07 - item
    tool_08 - item
    tool_09 - item
    container_04 - container
    container_05 - container
  )
  (:init
    (ontable tool_06)
    (ontable tool_07)
    (ontable tool_08)
    (in tool_04 container_05)
    (in tool_09 container_04)
    (clear tool_06)
    (clear tool_07)
    (clear tool_08)
    (handempty)
  )
  (:goal (and ))
)