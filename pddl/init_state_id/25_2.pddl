(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_05 - item
    office_08 - item
    container_05 - container
  )
  (:init
    (ontable office_02)
    (ontable office_05)
    (ontable office_08)
    (ontable container_05)
    (clear office_02)
    (clear office_05)
    (clear office_08)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)