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
    (ontable tool_06)
    (ontable other_04)
    (ontable container_03)
    (ontable container_05)
    (clear office_06)
    (clear tool_02)
    (clear tool_04)
    (clear tool_06)
    (clear other_04)
    (clear container_03)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)