(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_04 - item
    office_09 - item
    tool_02 - item
    tool_06 - item
    tool_09 - item
    container_03 - container
  )
  (:init
    (ontable office_02)
    (ontable office_04)
    (ontable office_09)
    (ontable tool_02)
    (ontable tool_06)
    (ontable tool_09)
    (ontable container_03)
    (clear office_02)
    (clear office_04)
    (clear office_09)
    (clear tool_02)
    (clear tool_06)
    (clear tool_09)
    (clear container_03)
    (handempty)
  )
  (:goal (and ))
)