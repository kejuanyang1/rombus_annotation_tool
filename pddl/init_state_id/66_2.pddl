(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_05 - item
    office_08 - item
    tool_02 - item
  )
  (:init
    (ontable office_02)
    (ontable office_05)
    (ontable office_08)
    (ontable tool_02)
    (clear office_02)
    (clear office_05)
    (clear office_08)
    (clear tool_02)
    (handempty)
  )
  (:goal (and ))
)