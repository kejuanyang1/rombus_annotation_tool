(define (problem scene1)
  (:domain manip)
  (:objects
    office_04 - item
    office_05 - item
    office_07 - item
    tool_05 - item
    tool_08 - item
  )
  (:init
    (ontable office_04)
    (ontable office_05)
    (ontable office_07)
    (ontable tool_05)
    (ontable tool_08)
    (clear office_04)
    (clear office_05)
    (clear office_07)
    (clear tool_05)
    (clear tool_08)
    (handempty)
  )
  (:goal (and ))
)