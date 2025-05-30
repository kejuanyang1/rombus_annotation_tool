(define (problem scene1)
  (:domain manip)
  (:objects
    office_01 - item
    office_02 - item
    tool_05 - item
    tool_09 - item
    other_04 - support
    container_04 - container
  )
  (:init
    (ontable office_01)
    (ontable office_02)
    (ontable tool_09)
    (in tool_05 container_04)
    (ontable other_04)
    (ontable container_04)
    (handempty)
    (clear office_01)
    (clear office_02)
    (clear tool_09)
    (clear other_04)
  )
  (:goal (and ))
)