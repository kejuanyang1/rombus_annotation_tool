(define (problem scene1)
  (:domain manip)
  (:objects
    office_07 - item
    office_08 - item
    tool_03 - item
    tool_05 - item
    other_02 - item
  )
  (:init
    (ontable office_07)
    (ontable office_08)
    (ontable tool_03)
    (ontable tool_05)
    (ontable other_02)
    (clear office_07)
    (clear office_08)
    (clear tool_03)
    (clear tool_05)
    (clear other_02)
    (handempty)
  )
  (:goal (and ))
)