(define (problem scene1)
  (:domain manip)
  (:objects
    office_10 - item
    tool_07 - item
    tool_08 - item
    other_02 - item
    other_03 - support
    other_04 - support
  )
  (:init
    (ontable office_10)
    (ontable tool_07)
    (ontable tool_08)
    (ontable other_02)
    (ontable other_03)
    (ontable other_04)
    (clear office_10)
    (clear tool_07)
    (clear tool_08)
    (clear other_02)
    (clear other_03)
    (clear other_04)
    (handempty)
  )
  (:goal (and ))
)