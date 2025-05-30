(define (problem scene1)
  (:domain manip)
  (:objects
    office_10 - item
    tool_03 - item
    tool_04 - item
    tool_06 - item
  )
  (:init
    (ontable office_10)
    (ontable tool_03)
    (ontable tool_04)
    (ontable tool_06)
    (clear office_10)
    (clear tool_03)
    (clear tool_04)
    (clear tool_06)
    (handempty)
  )
  (:goal (and ))
)