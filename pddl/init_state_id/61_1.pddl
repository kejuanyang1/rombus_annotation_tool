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
    (ontable office_02)
    (ontable tool_05)
    (ontable tool_09)
    (in office_01 container_04)
    (in other_04 container_04)
    (ontable container_04)
    (handempty)
    (clear office_02)
    (clear tool_05)
    (clear tool_09)
  )
  (:goal (and ))
)