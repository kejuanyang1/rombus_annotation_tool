(define (problem scene1)
  (:domain manip)
  (:objects
    office_01 - item
    office_03 - item
    office_05 - item
    office_07 - item
    office_08 - item
    office_09 - item
  )
  (:init
    (ontable office_01)
    (ontable office_03)
    (ontable office_05)
    (ontable office_07)
    (ontable office_08)
    (ontable office_09)
    (clear office_01)
    (clear office_03)
    (clear office_05)
    (clear office_07)
    (clear office_08)
    (clear office_09)
    (handempty)
  )
  (:goal (and ))
)