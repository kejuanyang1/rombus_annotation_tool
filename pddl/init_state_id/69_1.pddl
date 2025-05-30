(define (problem scene1)
  (:domain manip)
  (:objects
    office_06 - item
    tool_02 - item
    tool_04 - item
    tool_06 - item
    other_04 - support
    container_03 - container
    container_05 - container
  )
  (:init
    (ontable office_06)
    (ontable tool_02)
    (ontable tool_04)
    (in tool_06 container_05)
    (in other_04 container_03)
    (handempty)
    (clear office_06)
    (clear tool_02)
    (clear tool_04)
  )
  (:goal (and ))
)