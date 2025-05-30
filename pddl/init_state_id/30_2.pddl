(define (problem scene1)
  (:domain manip)
  (:objects
    office_01 - item
    office_03 - item
    office_06 - item
    office_08 - item
    office_10 - item
  )
  (:init
    (ontable office_01)
    (ontable office_03)
    (ontable office_06)
    (ontable office_08)
    (ontable office_10)
    (clear office_01)
    (clear office_03)
    (clear office_06)
    (clear office_08)
    (clear office_10)
    (handempty)
  )
  (:goal (and ))
)